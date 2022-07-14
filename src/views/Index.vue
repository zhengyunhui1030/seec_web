<template>
    <div>
        <h3>数据的增删改查</h3>
        <el-table
        :data="tableData"
        style="width:100%"
        >
            <el-table-column
                prop="date"
                label="日期"
                align="center"
                width="100px">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                align="center"
                width="100px">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址"
                align="center"
                width="400px">
                <template slot="header" slot-scope="scope">
                    <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"/>
                </template>
            </el-table-column>
            <el-table-column
                label="修改"
                align="right"
                width="300px">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope)">Edit</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表单 -->
        <MyDialog 
        :form="form" 
        :dialogFormVisible="dialogFormVisible" 
        :formLabelWidth="formLabelWidth"
        @cancel_my="cancelfn"
        @confirmfn_my="confirmfn"
        ></MyDialog>
        <div>
            <el-button @click="addfn">增加新用户</el-button>
        </div>
        <!-- 增加的弹窗 -->
        <AddDialog
        :addform="addform"
        :formLabelWidth="formLabelWidth"
        :incrementform="incrementform"
        @addcancel_my="addcancelfn"
        @addconfirm_my="addconfirmfn"
        ></AddDialog>
        <!-- <button @click="getkan">看数据是否更改</button> -->
    </div>
</template>
<script>
import dayjs from 'dayjs';
import instance from '../api/api';
import MyDialog from '@/components/MyDialog'
import AddDialog from '@/components/AddDialog'
export default {
    name:"Index",
    data(){
        return{
            search: '',
            tableData: [],
            dialogFormVisible: false, //表单的显示隐藏
            form: {
                index: 0,
                date: null,
                name: '',
                address: '',
            },  // 表单的内容
            formLabelWidth: '120px',
            incrementform:false, // 决定增加表单是否显示
            addform:{ //增加表单绑定的数据
                date:null,
                name:'',
                address:''
            }
        }
    },
    created(){
        this.getall();
    },
    components:{
        MyDialog,
        AddDialog
    },
    methods:{
        //增加的取消功能
        addcancelfn(){
            this.incrementform = true;
        },
        //增加的确认功能
        addconfirmfn(){
            this.incrementfn()
            .then(()=>{
                this.$message({
                    type:"success",
                    message:'添加成功',
                    duration:3000,
                    onClose:()=>{
                        this.incrementform = false;
                        this.getall()
                    }
                })
            })
            .catch()

        },
        addfn(){
            this.incrementform = true;
        },
        getkan(){
            instance.get('/all').then((res)=>console.log(res))
        },
        
        handleEdit(scope) {
            console.log(scope);
            this.form = scope.row;
            // this.form.date = JSON.stringify(this.form.date)
            this.form.index = scope.$index;
            this.dialogFormVisible = true;
           
        },
        handleDelete(scope) {
            console.log(scope);
            this.$confirm('确定删除吗？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.deletefn(scope.$index).then(()=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });    
            })
        },
        cancelfn(){
            this.dialogFormVisible = false;
        },
        confirmfn(){
            this.dialogFormVisible = false;
            this.form.date = dayjs(new Date(this.form.date)).format('YYYY-MM-DD')
            this.updatefn();
        },
        //增加业务
        async incrementfn(){
            let {date,name,address} = this.addform;
            let {data} = await instance.post("/add",{date,name,address})
        },
        //修改业务
        async updatefn(){
            let {date,name,address,index} = this.form;
            let {data} = await instance.put("/update",{date,name,address,index});
            console.log(data);
        },
        //删除业务
        async deletefn(index){
            let {data} = await instance.delete("/delete",{params:{index}});
            console.log(data);
            this.getall();
        },
        //请求数据的业务
        async getall(){
            let {data} = await instance.get("/all");
            console.log(data);
            this.tableData = data.tableData;
        }
    }
}
</script>
<style lang="scss" scoped>
    
</style>