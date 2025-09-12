<template>
  <div class="app-container business-release">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="125px">
      <el-form-item label="企微发布人名称">
        <el-input v-model="queryParams.wecomUserName" placeholder="请输入企微发布人名称" clearable />
      </el-form-item>
      <el-form-item label="企微公司名称">
        <el-input v-model="queryParams.wecomCompName" placeholder="请输入企微公司名称" clearable />
      </el-form-item>

      <el-form-item label="是否删除">
        <el-select :style="{ width: '100%' }" v-model="queryParams.isDelete" placeholder="请选择是否删除" clearable filterable>
          <el-option v-for=" item in deleteOption " :key="item.value" label="" :value="item.value" />
          <el-option v-for=" item in deleteOption " :key="item.value" :label="item.labelCn" :value="item.value" />
          <el-option v-for=" item in deleteOption " :key="item.value" :label="item.labelCn" :value="item.value" />
          <el-option v-for=" item in deleteOption " :key="item.value" :label="item.labelCn" :value="item.value" />
          <el-option v-for=" item in deleteOption " :key="item.value" :label="item.labelCn" :value="item.value" />
          <el-option v-for=" item in deleteOption " :key="item.value" :label="item.labelCn" :value="item.value" />
          <el-option v-for=" item in deleteOption " :key="item.value" :label="item.labelCn" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="删除原因">
        <el-select :style="{ width: '100%' }" v-model="queryParams.delType" placeholder="请选择删除原因" clearable filterable>
          <el-option v-for=" item in delTypeOption " :key="item.value" :label="item.labelCn" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布人名称">
        <el-select :style="{ width: '100%' }" v-model="queryParams.userId" placeholder="请输入客户名称" clearable
          @change="toSelectQ" filterable remote :remote-method="handleInputUser">
          <el-option v-for=" user in userList " :key="user.id" :label="isNameCAE( user, 'name' )" :value="user.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称">
        <el-select :style="{ width: '100%' }" v-model="queryParams.compId" placeholder="请输入公司名称" clearable
          @change="toSelectQ" filterable remote :remote-method="handleInputComp">
          <el-option v-for=" ac in companyList " :key="ac.id" :label="ac.name" :value="ac.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="商机内容">
        <el-input v-model="queryParams.content" placeholder="请输入商机内容" maxlength="64" clearable />
      </el-form-item>
      <el-form-item label="发布类型">
        <el-select :style="{ width: '100%' }" v-model="queryParams.publicationType" placeholder="请选择是否删除" clearable
          filterable>
          <el-option v-for=" item in publicationTypeOption " :key="item.value" :label="item.labelCn"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布方式">
        <el-select :style="{ width: '100%' }" v-model="queryParams.publicationMode" placeholder="请选择是否删除" clearable
          filterable>
          <el-option v-for=" item in publicationModeOption " :key="item.value" :label="item.labelCn"
            :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="来源渠道">
        <el-select :style="{ width: '100%' }" v-model="queryParams.sourceChannel" placeholder="请选择是否删除" clearable
          filterable>
          <el-option v-for=" item in sourceChannelOption " :key="item.value" :label="item.labelCn"
            :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="会员公司身份">
        <el-select v-model="queryParams.publisherIdentityList" multiple placeholder="请输入会员公司身份">
          <el-option v-for=" item in publisherOptions " :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker :style="{ width: '100%' }" v-model="recordTime" type="datetimerange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleTimeChange"></el-date-picker>
        <!--  :picker-options="pickerOptions" -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表显示条数操作 -->
    <div>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </div>
    <el-table stripe v-loading="loading" :data="tableData" border>
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column align="center" label="商机发布人" prop="userName" key="userName" resizable>
        <template slot-scope="scope">
          <span :class="{ 'name-wrapper': !scope.row.showUserName }"
            @click="handleNameClick( scope.$index, 'showUserName' )">{{ scope.row.userName }}</span>
          <i class="el-icon-document-copy copy-icon" @click="copyCnLink( scope.row.userName )"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商机发布人（企微）" prop="wecomUserName" key="wecomUserName" resizable>
        <template slot-scope="scope">
          <span :class="{ 'name-wrapper': !scope.row.showWecomUserName }"
            @click="handleNameClick( scope.$index, 'showWecomUserName' )">{{ scope.row.wecomUserName }}</span>

          <i class="el-icon-document-copy copy-icon" @click="copyCnLink( scope.row.wecomUserName )"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司名称" prop="compName" key="compName" resizable>
        <template slot-scope="scope">
          <span :class="{ 'name-wrapper': !scope.row.showCompName }"
            @click="handleNameClick( scope.$index, 'showCompName' )">{{ scope.row.compName }}</span>
          <i class="el-icon-document-copy copy-icon" @click="copyCnLink( scope.row.compName )"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司名称（企微）" prop="wecomCompName" key="wecomCompName" resizable>
        <template slot-scope="scope">
          <span :class="{ 'name-wrapper': !scope.row.showWecomCompName }"
            @click="handleNameClick( scope.$index, 'showWecomCompName' )">{{ scope.row.wecomCompName }}</span>
          <i class="el-icon-document-copy copy-icon" @click="copyCnLink( scope.row.wecomCompName )"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布人身份" prop="publisherIdentityList" key="publisherIdentityList" resizable>
        <template slot-scope="scope">
          <span>{{ scope.row.publisherIdentityList && scope.row.publisherIdentityList.map( item =>
            getDictLabel( publisherOptions, item ) ).join( ',' )
            }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商机内容" prop="content" resizable>
        <template slot-scope="scope">
          <span :class="{ 'name-wrapper': !scope.row.showContent }" @click="handleOpenDetail( scope.row )">{{
            scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="起始地" prop="fromCityNameList">
        <template slot-scope="scope">{{
          scope.row.fromCityNameList ? scope.row.fromCityNameList.join( "，" ) : ""
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="目的地" prop="toCityNameList">
        <template slot-scope="scope">{{
          scope.row.toCityNameList ? scope.row.toCityNameList.join( "，" ) : ""
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="来源渠道" prop="sourceChannel">
        <template slot-scope="scope">{{
          getLabel( scope.row.sourceChannel, "sourceChannel" )
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="来源群聊" prop="sourceGroup">
        <template slot-scope="scope">{{ scope.row.sourceGroup }}</template>
      </el-table-column>
      <el-table-column align="center" label="发布类型" prop="publicationType">
        <template slot-scope="scope">{{
          getLabel( scope.row.publicationType, "publicationType" )
        }}</template>
      </el-table-column>

      <el-table-column align="center" label="商机发布时间" prop="releaseTime">
        <template slot-scope="scope">{{ parseTime( scope.row.releaseTime ) }}</template>
      </el-table-column>
      <el-table-column align="center" label="发布方式" prop="publicationMode">
        <template slot-scope="scope">{{
          getLabel( scope.row.publicationMode, "publicationMode" )
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="联系方式">
        <template slot-scope="scope">
          <el-button type="text" @click="handleOpenContact( scope.row )">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否删除" prop="delState">
        <template slot-scope="scope">{{
          scope.row.delState == "1" ? "是" : "否"
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="删除原因" prop="publicationMode">
        <template slot-scope="scope">{{ getLabel( scope.row.delType, "delType" ) }}
          <span v-if=" scope.row.delReason "> （{{ scope.row.delReason }}） </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="120px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDelete( scope.row )">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size"
      @pagination="getList" />
    <!-- 商机内容 -->
    <el-dialog v-if=" businessVisible " title="商机详情" :visible.sync="businessVisible" width="500px" append-to-body
      destroy-on-close :close-on-click-modal="false">
      <span style="white-space: pre-line">{{ currentRow.content }}</span>
    </el-dialog>
    <!-- 联系详情 -->
    <el-dialog v-if=" contactVisible " title="联系方式" :visible.sync="contactVisible" width="500px" append-to-body
      destroy-on-close :close-on-click-modal="false">
      <div>
        <el-descriptions title column="1">
          <el-descriptions-item label="手机号">
            {{ contactData.publisherTel }}
            <i v-if=" contactData.publisherTel " class="el-icon-document-copy pointer"
              @click="copyCnLink( contactData.publisherWechat )"></i>
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ contactData.publisherEmail }}
            <i v-if=" contactData.publisherEmail " class="el-icon-document-copy pointer"
              @click="copyCnLink( contactData.publisherEmail )"></i>
          </el-descriptions-item>
          <el-descriptions-item label="微信">
            {{ contactData.publisherWechat }}
            <i v-if=" contactData.publisherWechat " class="el-icon-document-copy pointer"
              @click="copyCnLink( contactData.publisherWechat )"></i>
          </el-descriptions-item>
          <el-descriptions-item label="QQ">
            {{ contactData.publisherQq }}
            <i v-if=" contactData.publisherQq " class="el-icon-document-copy pointer"
              @click="copyCnLink( contactData.publisherQq )"></i>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog v-if=" deleteVisible " title="提示" :visible.sync="deleteVisible" width="500px" append-to-body
      destroy-on-close :close-on-click-modal="false">
      <div>
        <el-form ref="delForm" :model="delForm" label-width="80px">
          <el-form-item label="删除原因" prop="delType" :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '请选择删除原因',
            },
          ]">
            <el-select :style="{ width: '100%' }" v-model="delForm.delType" placeholder="请选择删除原因" clearable filterable>
              <el-option v-for=" item in delTypeOption " :key="item.value" :label="item.labelCn" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if=" delForm.delType == '3' " label="备注" prop="reason" :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '请输入原因',
            },
          ]">
            <el-input v-model="delForm.reason" type="textarea" placeholder="请输入原因" clearable />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="handleSubmit()">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOpportunityList,
  getOpportunityInfo,
  opportunityDelete,
} from "@/api/freighCircle/businessManage";
import { getEnumList } from "@/api/freighCircle/orderManage";
import { companyList } from "@/api/risk/dispute";
import { listAccountAll } from "@/api/cmc/advantage";
import debounce from "lodash/debounce";
import { getDicts } from '@/api/system/dict/data'
// import { getDictLabel } from '@/utils/dict/Label'

export default {
  name: "ReleaseCenter",
  data() {
    return {
      loading: false,
      subLoading: false,
      queryParams: {
        current: 1,
        size: 10,
        sourceType: "",
        releaseStartTime: undefined,
        releaseEndTime: undefined,
        publisherIdentityList: [], // 发布人身份
      },
      total: 0,
      showSearch: true,
      recordTime: "",

      tableData: [],
      // 公司列表
      companyList: [],
      // 客户列表
      userList: [],
      // 是否删除
      deleteOption: [
        { labelCn: "全部", value: "" },
        { labelCn: "否", value: "0" },
        { labelCn: "是", value: "1" },
      ],
      // 删除原因
      delTypeOption: [],
      // 来源渠道
      sourceChannelOption: [],
      // 发布类型
      publicationTypeOption: [],
      // 发布方式
      publicationModeOption: [],
      currentRow: {},
      // 商机详情弹窗
      businessVisible: false,
      // 联系方式
      contactVisible: false,
      contactData: {},
      // 删除
      deleteVisible: false,
      delForm: {
        delType: "",
        reason: "",
      },
      // 发布人身份列表
      publisherOptions: []
    };
  },
  created() {
    this.getEnum();
    this.getList();
    // 获取发布人身份列表
    getDicts('OPT_PUBLISHER_IDENTITY')
      .then((res) => {
        if (res.code === 0) {
          this.publisherOptions = res.data.records.map((item) => {
            return {
              ...item,
              label: item.dictLabel,
              value: item.dictValue
            }
          })
        }
      })
      .catch((e) => console.error(e))
  },
  methods: {
    getDictLabel(dict, value) {
      console.log("🍉 ~ index.vue:335 ~ getDictLabel ~ value:", value)
      const res = dict.find((item) => item.dictValue === value)
      return (res && res.dictLabel) || value
    },
    getEnum() {
      // 删除原因
      getEnumList({ key: "BO_DELETE_TYPE_ENUM" }).then((res) => {
        this.delTypeOption = res.data.records;
      });
      // 发布类型
      getEnumList({ key: "BO_PUBLICATION_TYPE_ENUM" }).then((res) => {
        this.publicationTypeOption = res.data.records;
      });
      // 发布方式
      getEnumList({ key: "OPPORTUNITY_PUBLISH_MODEL_ENUM" }).then((res) => {
        this.publicationModeOption = res.data.records;
      });
      // 来源渠道
      getEnumList({ key: "BO_SOURCE_CHANNEL_ENUM" }).then((res) => {
        this.sourceChannelOption = res.data.records;
      });
    },
    getList() {
      this.loading = true;
      getOpportunityList({ ...this.queryParams })
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.records;
          // this.tableData = [
          //   {
          //     "id": 78,
          //     "wecomUserName": "宁03",
          //     "wecomCompName": "宁03公司",
          //     "compId": 3031189,
          //     "compName": null,
          //     "userId": 3014409,
          //     "userName": null,
          //     "publisherHeadSculpture": null,
          //     "content": "自行车，不带电，到土耳其双清包税，143*74*20cm，15kg，16140 Nilufer  Bursa Tr，Turkey City Bursa，请分别报两台车和四台车的价格 qq:6237816387912",
          //     "fromCityNameList": [],
          //     "toCityNameList": [],
          //     publisherIdentityList: ['', 'qwer'],
          //     "sourceChannel": "",
          //     "sourceGroup": null,
          //     "publicationType": "0",
          //     "publicationMode": null,
          //     "releaseTime": "2024-12-03 20:00:00",
          //     "delState": null,
          //     "delType": null,
          //     "delReason": null
          //   },
          //   {
          //     "id": 78,
          //     "wecomUserName": "宁03",
          //     "wecomCompName": "宁03公司",
          //     "compId": 3031189,
          //     "compName": null,
          //     "userId": 3014409,
          //     "userName": null,
          //     "publisherHeadSculpture": null,
          //     "content": "自行车，不带电，到土耳其双清包税，143*74*20cm，15kg，16140 Nilufer  Bursa Tr，Turkey City Bursa，请分别报两台车和四台车的价格 qq:6237816387912",
          //     "fromCityNameList": [],
          //     "toCityNameList": [],
          //     publisherIdentityList: ['', 'qwer'],
          //     "sourceChannel": "",
          //     "sourceGroup": null,
          //     "publicationType": "0",
          //     "publicationMode": null,
          //     "releaseTime": "2024-12-03 20:00:00",
          //     "delState": null,
          //     "delType": null,
          //     "delReason": null
          //   },
          //   {
          //     "id": 78,
          //     "wecomUserName": "宁03",
          //     "wecomCompName": "宁03公司",
          //     "compId": 3031189,
          //     "compName": null,
          //     "userId": 3014409,
          //     "userName": null,
          //     "publisherHeadSculpture": null,
          //     "content": "自行车，不带电，到土耳其双清包税，143*74*20cm，15kg，16140 Nilufer  Bursa Tr，Turkey City Bursa，请分别报两台车和四台车的价格 qq:6237816387912",
          //     "fromCityNameList": [],
          //     "toCityNameList": [],
          //     publisherIdentityList: ['', 'qwer'],
          //     "sourceChannel": "",
          //     "sourceGroup": null,
          //     "publicationType": "0",
          //     "publicationMode": null,
          //     "releaseTime": "2024-12-03 20:00:00",
          //     "delState": null,
          //     "delType": null,
          //     "delReason": null
          //   },
          // ]
          this.total = res.data.total;
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    //获取label
    getLabel(value, type) {
      if (!value) {
        return "";
      } else {
        const item = this[`${type}Option`].find((item) => item.value === value);
        return item?.labelCn;
      }
    },
    // 名字点击
    handleNameClick(index, attr) {
      this.$set(this.tableData[index], attr, true);
    },
    copyCnLink(val) {
      this.msgSuccess("复制成功");
      navigator.clipboard.writeText(val);
    },
    toSelectQ(e) { },
    handleInputComp: debounce(function (val) {
      this.getCompanyAlllist(val);
    }, 500),
    // 获取所有公司列表
    getCompanyAlllist(queryString) {
      companyList({ param: queryString })
        .then((res) => {
          this.companyList = res.data.records;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleInputUser: debounce(function (val) {
      this.getUserAlllist(val);
    }, 500),
    getUserAlllist(keyWord) {
      listAccountAll({ keyWord })
        .then((res) => {
          this.userList = res.data.records;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 到账时间改变
    handleTimeChange(range) {
      if (range?.length) {
        this.queryParams.releaseStartTime = range[0];
        this.queryParams.releaseEndTime = range[1];
      } else {
        this.queryParams.releaseStartTime = "";
        this.queryParams.releaseEndTime = "";
      }
    },
    // 商机详情
    handleOpenDetail(row) {
      this.businessVisible = true;
      this.currentRow = row;
    },
    // 联系详情
    handleOpenContact(row) {
      this.currentRow = row;
      this.contactVisible = true;
      getOpportunityInfo({ id: row.id }).then((res) => {
        if (res.code == 0) {
          this.contactData = res.data;
        }
      });
    },
    // 删除
    handleDelete(row) {
      this.currentRow = row;
      this.deleteVisible = true;
    },
    // 开通
    handleOpen(row) {
      this.currentRow = row;
      this.openVisible = true;
    },
    // 删除原因提交
    handleSubmit() {
      this.$refs.delForm.validate((v) => {
        if (v) {
          this.subLoading = true;
          opportunityDelete({ id: this.currentRow.id, ...this.delForm })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success(res.msg);
                this.getList();
                this.handleClose();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => { })
            .finally(() => {
              this.subLoading = false;
            });
        }
      });
    },
    // 删除原因取消

    handleClose() {
      this.$refs.delForm.clearValidate();
      this.delForm = {
        delType: "",
        reason: "",
      };
      this.deleteVisible = false;
    },
    // 查询按钮点击
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    // 重置按钮点击
    resetQuery() {
      this.queryParams = {
        current: 1,
        size: 10,
        releaseStartTime: undefined,
        releaseEndTime: undefined,
        sourceType: "",
      };
      this.recordTime = "";
      this.handleQuery();
    },
  },
};
</script>

<style scoped lang="less">
.business-release {
  .name-wrapper {
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .copy-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    cursor: pointer;
    color: #409eff;
  }

  .pointer {
    cursor: pointer;
  }
}
</style>
