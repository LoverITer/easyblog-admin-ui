<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/goods">添加商品</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <!--顶部提示-->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!--步骤条-->
      <el-steps :space="200" align-center :active="getActiveStepByActiveTab" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="goodsAddForm" :rules="goodsAddRules" ref="goodsFormRef" label-position="top">
        <el-tabs v-model="activeTab" :tab-position="'left'" :before-leave="handleTabLeave" @tab-click="switchTab">
          <el-tab-pane label="基本信息" name="base_info">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsAddForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="goodsAddForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="goodsAddForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="goodsAddForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
               <el-cascader :options="categories"
                               :props="categoryProps"
                               v-model="selectKeys"
                               @change="cascaderSelectedRefresh">
               </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="goods_params">
            <el-form-item :label="item.attr_name" v-for="item in goods_params" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="goods_properties">
            <el-form-item :label="item.attr_name" v-for="item in goods_properties" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="goods_pic">
            <!--
            action 表示图片上传的后台地址 需要填写API完整地址
            -->
            <el-upload :action="uploadURL"
                       :on-preview="showPreview"
                       :on-remove="removePicHandler"
                       :headers="uploadHeader"
                       :on-success="uploadSuccessHandler"
                       list-type="picture">
              <el-button size="small" type="primary">上传图片</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="goods_content">
            <!--富文本编辑器组件-->
            <quill-editor v-model="goodsAddForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" style="margin-top: 15px" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>


    <el-dialog title="图片预览" :visible.sync="previewDisible">
      <img :src="previewPicURL" class="preview-img">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'goods-add',
  data () {
    return {
      activeTab: 'base_info',
      //图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      uploadHeader:{
        //设置图片上传请求头
        Authorization:window.sessionStorage.getItem('LOGIN_TOKEN')
      },
      //预览图片地址
      previewPicURL:'',
      previewDisible: false,
      tabStepMap: new Map([
        ['base_info',0],
        ['goods_params',1],
        ['goods_properties',2],
        ['goods_pic',3],
        ['goods_content',4],
        ['finished',5]
      ]),
      goodsAddForm:{
        goods_name:'',
        goods_price:'',
        goods_weight:'',
        goods_number:'',
        goods_cat: '',   //商品所属分类,多个由英文逗号分割，数据来源于 selectKeys
        pics:[],   //上传的图片
        goods_introduce:'',   //商品描述
        goods_attrs:[]    //商品的参数（动态参数+静态参数）
      },
      goodsAddRules: {
        goods_name: {required:true,message:'请输入商品名称',trigger: 'blur'},
        goods_price: {required:true,message:'请输入商品价格',trigger: 'blur'},
        goods_weight: {required:true,message:'请输入商品重量',trigger: 'blur'},
        goods_number: {required:true,message:'请输入商品数量',trigger: 'blur'},
        selectKeys: {required:true,message:'请选中商品分类',trigger: 'blur'}
      },
      categories:[],   //商品分类列表
      categoryProps: {   //配置项，级联选择器上下级对应关系
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectKeys:[],   //级联选择器选中的item的key
      goods_params:[], //商品动态参数列表
      goods_properties:[]  //商品静态属性列表
    }
  },
  computed:{
    getActiveStepByActiveTab(){
      let activeStep = this.tabStepMap.get(this.activeTab)
      if(undefined === activeStep){
        return 0;
      }
      return activeStep
    },
    getCategoryId () {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    }
  },
  methods: {
    //加载商品列表
    getCateList () {
      this.$http.get('categories').then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取商品分类列表数据失败！')
        }
        this.categories = resp.data
      })
    },
    //加载商品动态参数
    getCateParams () {
      this.$http.get(`categories/${this.getCategoryId}/attributes`,
        {
          params: { sel: 'many' }
        }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取商品参数数据失败！')
        }
        resp.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',').filter(function (val) {
            return val !== ''
          }) : []
        })
        this.goods_params = resp.data
      })
    },
    //加载静态属性
    getCateProperties () {
      this.$http.get(`categories/${this.getCategoryId}/attributes`,
        {
          params: { sel: 'only' }
        }).then(response => {
        let resp = response.data
        if (resp.meta.status !== 200) {
          return this.$message.error('获取商品属性数据失败！')
        }
        resp.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',').filter(function (val) {
            return val !== ''
          }) : []
        })
        this.goods_properties = resp.data
      })
    },
    cascaderSelectedRefresh () {
      if (this.selectKeys.length !== 3) {
        //不是三级分类
        this.selectKeys = []
        this.$message.info('只允许选择三级分类')
      }
    },
    //处理tab切换动作
    handleTabLeave (newTabName, oldTabName) {
      if (oldTabName === 'base_info' && this.selectKeys.length !== 3) {
        this.$message.error('请先选择产品分类')
        return false
      }
    },
    //tab且切换
    switchTab () {
      if (this.activeTab === 'goods_params') {
        //加载动态参数数据
        this.getCateParams()
      } else if (this.activeTab === 'goods_properties') {
        //加载静态属性
        this.getCateProperties()
      }
    },
    //预览上传的图片
    showPreview(file){
       this.previewPicURL=file.response.data.url
       this.previewDisible=true
    },
    //删除上传图片 图片组件会在调用方法的时候传入移除图片的名称
    removePicHandler(file){
      //获取将要删除的图片的路径
      const filePath=file.response.data.tmp_path
      //从pics数组中找到这个图片的索引值
      const index=this.goodsAddForm.pics.findIndex(item=>
        item.pic === filePath)
      //3.调用数组的splice方法把图片对象从pics数组中移除
      this.goodsAddForm.pics.splice(index,1)
      console.log(this.goodsAddForm.pics)
    },
    //图片上传成功后操作 图片组件会在调用后传入服务器的响应值
    uploadSuccessHandler(response){
      //1.拼接获得图片信息对象
      //2.将图片添加到数组中
      this.goodsAddForm.pics.push({
        pic: response.data.tmp_path
      })

      console.log(this.goodsAddForm.pics)
    },
    addGoods(){
      this.$refs.goodsFormRef.validate(valid=>{
        if(!valid){
          return this.$message.error('请检查输入')
        }

        this.goodsAddForm.goods_cat=this.selectKeys.join(",")
        //处理动态参数
        this.goods_params.forEach(item=>{
          console.log(item)
          this.goodsAddForm.goods_attrs.push({'attr_id':item.attr_id,'attr_value':item.attr_vals})
        })
        //处理静态属性
        this.goods_properties.forEach(item=>{
          this.goodsAddForm.goods_attrs.push({'attr_id':item.attr_id,'attr_value':item.attr_vals})
        })

        console.log(this.goodsAddForm)
        //发请求保存添加商品的参数
        this.$http.post('goods',this.goodsAddForm).then(response=>{
          let resp=response.data
          if(resp.meta.status!==201){
            return this.$message.error('请检查输入')
          }
        })
        this.$message.success('添加商品成功！')
        this.activeTab = 'finished'
      })
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.preview-img{
  width: 100%;
}

</style>
