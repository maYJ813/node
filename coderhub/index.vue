console.log("🚀 ~ <template>
  <div ref="containerRef" class="page-wrapper">
    <header class="header">
      <div class="title">企业概览</div>
      <div class="search">
        <quick-search ref="quickSearchRef" :quick-type="1" @quickSearch="getQuickSearchData"
                      @quickSearchParams="getQuickSearchParams"></quick-search>
        <Form ref="formInline" :label-width="80" :model="formInline" inline>
          <FormItem label="本期范围">
            <DatePicker v-model="formInline.currentDate" :clearable="false" :options="dateOptions" format="yyyy-MM-dd"
                        placeholder="本期时间范围" type="daterange" @on-change="timeInputClick($event, 1)">
            </DatePicker>
          </FormItem>
          <FormItem label="上期范围">
            <DatePicker v-model="formInline.preDate" :clearable="false" :options="dateOptions" format="yyyy-MM-dd"
                        placeholder="上期时间范围" type="daterange" @on-change="timeInputClick($event, 2)">
            </DatePicker>
          </FormItem>
          <FormItem label="部门选择">
            <!-- 部门 -->
            <department-select
              ref="department"
              :clearable="false"
              :containUnGroupTag="0"
              :enterprise-id="enterpriseId"
              :isAutoOrgTop="true"
              :mixedDefaultData="mixedDefaultData"
              :mixedSelection="true"
              :multiple="true"
              :showDepartment="false"
              :showSelectOrg="true"
              :showSelectTag="false"
              :value.sync="department"
              class="depart-select"
              placeholder="点击选择组织"
              @onCheckedData="getDepCheckedData"></department-select>
          </FormItem>
          <FormItem>
            <div class="search-btn">
              <Button class="form-item-btn" type="primary" @click="search">查询</Button>
              <Button class="form-item-btn" @click="reset">重置</Button>
              <Button class="form-item-btn" @click="exportPdf">导出pdf</Button>
              <Poptip v-model="poptipVisible" placement="bottom" width="300">
                <p class="quick-save">
                  <Icon type="ios-folder-outline"/>
                  保存筛选条件
                </p>
                <div slot="content" class="quick-input">
                  <p><Input v-model="quickInput" :maxlength="20" :show-word-limit="true"/></p>
                  <p class="btn">
                    <Button @click="quickCancelHandle">取消</Button>
                    <Button type="primary" @click="quickSaveHandle">保存</Button>
                  </p>
                </div>
              </Poptip>
            </div>
          </FormItem>
        </Form>
      </div>
    </header>
    <div class="container">
      <!-- 数据概览 -->
      <div class="box">
        <div class="box-header">
          <p class="title">数据总览</p>
          <div class="btn btn-option">
            <Button @click="metricsFlag = !metricsFlag">指标选择</Button>
            <div v-show="metricsFlag" class="metrics-list">
              <CheckboxGroup v-model="metricsList" @on-change="metricsChange">
                <p v-for="(item, index) in cartsList" :key="index" class="item">
                  <Checkbox :label="item.name">{{ item.name }}</Checkbox>
                </p>
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <div v-if="defPassTaskScale != null || defAverageScoreScale != null" class="box-desc">
          <span v-if="defPassTaskScale != null">本期暗访门店合格率环比上期呈{{ defPassTaskScale >= 0 ? '上升' : '下降'
            }}趋势，{{
              defPassTaskScale >= 0 ? `上升了${ defPassTaskScale }%` : `下降了${ Math.abs(defPassTaskScale) }%`
            }}；</span>
          <span v-if="defAverageScoreScale != null">平均得分率较上期同样呈{{ defAverageScoreScale >= 0 ? '上升' : '下降'
            }}趋势，{{
              defAverageScoreScale >= 0
                ? `上升了${ defAverageScoreScale }%`
                : `下降了${ Math.abs(defAverageScoreScale) }%`
            }}</span>
        </div>
        <div class="box-cards">
          <div v-for="item in cartsList" :key="item.name" :class="!item.checked ? 'cart-item' : ''" class="card">
            <p class="card-title">
              <span>{{ item.name }}</span>
              <Tooltip :content="item.tip" placement="top-start">
                <SvgIcon icon-class="help"></SvgIcon>
              </Tooltip>
            </p>
            <p class="card-num">{{ item[item.key] == null ? '--' : `${ item[item.key] }` }} <span
              v-if="item[item.key] != null && item.isPercent" class="card-num-percent">%</span></p>
            <p v-if="item[item.diffKey] != null" class="card-rate">
              <span>较上期</span>
              <span :class="!item.upOrDown ? 'rate-down' : ''" class="rate">
                {{ Math.abs(item[item.diffKey]) }} <span v-if="item.isPercent">%</span>
                <SvgIcon v-if="item[item.diffKey]!=0" :icon-class="item.upOrDown ? 'up' : 'down'" size="6"></SvgIcon>
              </span>
            </p>
          </div>
        </div>
      </div>
      <!-- 暗访门店分布 占比 -->
      <div class="box-sub">
        <div class="box">
          <div class="box-header">
            <p class="title">暗访门店分布
              <Tooltip content="报告等级：取后台门店得分率分档配置中的对应分档" placement="top-start">
                <SvgIcon icon-class="help"></SvgIcon>
              </Tooltip>
            </p>
            <div class="btn">
              <Button @click="downloadHandle('mapChart')">下载
                <SvgIcon icon-class="download"></SvgIcon>
              </Button>
            </div>
          </div>
          <div class="box-desc">本期暗访门店地域分布</div>
          <div class="charts">
            <div class="charts-label">
              <p v-for="(item,index) in mapLabelList" :key="index"><span :style="{background:`#${item.value}`}"></span>{{ item.name
                }}</p>
            </div>
            <div id="mapChart" ref="mapChart" style="height: 280px"></div>
          </div>
        </div>
        <ChartsBox :chart-desc="storeText"
                   :charts-obj="ratePieChart"
                   :down-excel="true"
                   :down-pic="true"
                   :search-params="params"
                   :tip-content="ratePieChart.tips"
                   chart-type="pie"
                   service="exportAgentDepByOrgExcel"
                   title="暗访门店占比">
        </ChartsBox>
      </div>
      <!-- 部门得分对比 -->
      <ChartsBox :chart-desc="depText"
                 :charts-obj="depRateChart"
                 :down-excel="true"
                 :down-pic="true"
                 :search-params="params"
                 :tip-content="depRateChart.tips"
                 chart-type="line"
                 service="exportOrgMarkCompareExcel"
                 title="部门得分对比">
        <template>
          <p class="chart-radio">
              <span :class="depRadio == 1 ? 'active-radio' : ''" class="chart-btn"
                    @click="radioChange(1, 1)">平均得分率</span>
            <span :class="depRadio == 2 ? 'active-radio' : ''" class="chart-btn"
                  @click="radioChange(1, 2)">平均得分</span>
          </p>
        </template>
      </ChartsBox>
      <!-- 报告等级分布 -->
      <ChartsBox :chart-desc="reportLevelText"
                 :charts-obj="storeLevelPieChart"
                 :otherChartsObj="storeLevelBarChart"
                 :down-excel="true"
                 :down-pic="true"
                 :search-params="params"
                 :tip-content="storeLevelPieChart.tips"
                 leftWidth="30%"
                 rigthWidth="70%"
                 service="exportDepRankDistributionExcel"
                 title="报告等级分布">
      </ChartsBox>
      <!-- 检查项大类得分对比 -->
      <ChartsBox :chart-desc="checkItemText"
                 :charts-obj="checkItemChart"
                 :down-excel="true"
                 :down-pic="true"
                 :search-params="params"
                 :tip-content="checkItemChart.tips"
                 service="exportParentTemplateCompareExcel"
                 title="检查项大类得分对比">
        <template>
          <p class="chart-radio">
              <span :class="checkItemRadio == 1 ? 'active-radio' : ''" class="chart-btn"
                    @click="radioChange(2, 1)">平均得分率</span>
            <span :class="checkItemRadio == 2 ? 'active-radio' : ''" class="chart-btn"
                  @click="radioChange(2, 2)">平均得分</span>
          </p>
        </template>
      </ChartsBox>

      <!-- 客户满意度 -->
      <ChartsBox :chart-desc="customText"
                 :charts-obj="customerBarChart"
                 :down-excel="false"
                 :down-pic="false"
                 :search-params="params"
                 :tip-content="customerBarChart.tips"
                 title="客户满意度">
      </ChartsBox>
      <ChartsBox chart-desc=""
                 :charts-obj="cursorChart"
                 :down-excel="true"
                 :down-pic="true"
                 :search-params="params"
                 :tip-content="cursorChart.tips"
                 service="exportOrgOrDepClientSatisfyScoreAndAverageScoreExcel"
                 title="得分率/满意度落点分布">
        <template>
          <p class="chart-radio">
            <span :class="scatterRadio == 1 ? 'active-radio' : ''" class="chart-btn"
                  @click="radioChange(3, 1)">部门</span>
            <span :class="scatterRadio == 2 ? 'active-radio' : ''" class="chart-btn"
                  @click="radioChange(3, 2)">门店</span>
          </p>
          <p class="chart-radio chart-icon">
            <img :class="currentChart == 1 ? 'current-chart' : ''" alt="" class="chart-img"
                 src="../../../assets/ico_chart_dian.png" @click="changeChartType(1)"/>
            <img :class="currentChart == 2 ? 'current-chart' : ''" alt="" class="chart-img"
                 src="../../../assets/ico_chart_zhu.png" @click="changeChartType(2)"/>
          </p>
        </template>
      </ChartsBox>
      <div class="box-sub">
        <div class="box">
          <div class="box-header">
            <p class="title">门店排名
              <Tooltip placement="top-start">
                <SvgIcon icon-class="help"></SvgIcon>
                <div slot="content">
                  <p>本期得分率： 本期时间范围内暗访总得分之和 / 本期时间范围内暗访总分之和</P>
                  <p>上期得分率： 上期时间范围内暗访总得分之和 / 上期时间范围内暗访总分之和</P>
                </div>
              </Tooltip>
            </p>
            <div class="btn">
              <Button @click="downloadHandle('store')">下载
                <SvgIcon icon-class="download"></SvgIcon>
              </Button>
            </div>
          </div>
          <div class="table-box">
            <Table :columns="storeColumn" :data="storeData" height="300" @on-sort-change="storeSortChange">
              <template slot="currentDepScoreRate" slot-scope="{row}">
                {{ row.currentDepScoreRate ? `${ row.currentDepScoreRate }%` : '--' }}
                <SvgIcon v-show="row._diff !=null && row._diff !=0"
                         :icon-class="row._diff>0?'ico_up':'ico_down'"></SvgIcon>
              </template>
            </Table>
            <Page :total="storeTotal" @on-change="storePageChange"/>
          </div>
        </div>
        <div class="box">
          <div class="box-header">
            <p class="title">检查小类排名</p>
            <div class="btn">
              <Button @click="downloadHandle('subItem')">下载
                <SvgIcon icon-class="download"></SvgIcon>
              </Button>
            </div>
          </div>
          <div class="table-box">
            <Table :columns="checkItemColumns" :data="checkItemData" height="300" @on-sort-change="itemSortChange">
              <template slot="currentScoreRate" slot-scope="{row}">
                {{ row.currentScoreRate ? `${ row.currentScoreRate }%` : '--' }}
                <SvgIcon v-show="row._diff !=null && row._diff !=0"
                         :icon-class="row._diff>0?'ico_up':'ico_down'"></SvgIcon>
              </template>
            </Table>
            <Page :total="checkItemTotal" @on-change="itemPageChange"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import api from '@/api/report-new';
import { exportAgentDepByOrgExcel, exportOrgMarkCompareExcel,exportDepRankDistributionExcel,exportParentTemplateCompareExcel,exportOrgOrDepClientSatisfyScoreAndAverageScoreExcel } from '@/api/report-new';
import exportFile from '@vensst/export-file';
import { downloadFile } from '@/utils/BaseUtil.js';
import { defaultMetrics,cartsList, ratePieChart, depRateChart,storeLevelPieChart, storeLevelBarChart,checkItemChart,customerBarChart,cursorChart  } from './config.js';
import BtnList from '../comps/index.vue';
import QuickSearch from '../comps/quick-search.vue';
import ChartsBox from '../comps/charts-box.vue';


export default {
  name: 'BusinessOverview',
  components: {
    BtnList,
    QuickSearch,
    // ErEcharts,
    ChartsBox,
  },
  data(){
    return {
      formInline: {
        currentDate: [],
        preDate: [],
        depIds: []
      },
      dateOptions: {
        disabledDate: date => {
          const _date = 365 * 24 * 3600 * 1000; // 12个月
          return date && date.valueOf() < Date.now() - _date;
        }
      },
      // 部门信息
      mixedDefaultData: {},
      department: [{}], // 门店信息,
      departmentName: [],
      enterpriseId: '',
      defaultDepList: [], // 默认顶层部门列表
      depNames: '',
      // 数据总览
      defPassTaskScale: 0,
      defAverageScoreScale: 0,
      metricsFlag: false,
      metricsList: defaultMetrics, //指标列表
      cartsList: JSON.parse(JSON.stringify(cartsList)),
      ratePieChart:ratePieChart,
      depRateChart:depRateChart,
      storeLevelPieChart:storeLevelPieChart,
      storeLevelBarChart:storeLevelBarChart,
      checkItemChart:checkItemChart,
      customerBarChart:customerBarChart,
      cursorChart:cursorChart,
      // cursorChart: null,
      mapMarkersData: [], // 地图标记数据
      mapLabelList: [],
      // 暗访门店占比
      storeText: '',

      // 部门得分对比
      depRadio: 1,
      depScoreMax: {key: '', diffValue: 0},
      depScoreMin: {key: '', diffValue: 0},
      depScoreChainMax: {key: '', value: 0},
      depScoreChainMin: {key: '', value: 0},
      depText: '',
      // 报告等级
      reportLevelText: '',

      // 检查项大类得分对比
      checkItemRadio: 1,
      checkItemScoreMax: {key: '', diffValue: 0},
      checkItemScoreMin: {key: '', diffValue: 0},
      checkItemChainMax: {key: '', value: 0},
      checkItemChainMin: {key: '', value: 0},
      checkItemText: '',

      // 满意度
      scatterRadio: 2,
      currentChart: 1,
      customText: '',

      pageSize: 10,
      storeNumber: 1,
      storeTotal: 0,
      storeOrderType: 1,
      storeColumn: [
        {
          title: '排名',
          key: 'rank',
          minWidth: 60,
        },
        {
          title: '门店名称',
          key: 'depName',
          render: (h, {row}) => {
            return h('p', row.depName || '--');
          },
          minWidth: 160,
        },
        {
          title: '本期得分率',
          key: 'currentDepScoreRate',
          slot: 'currentDepScoreRate',
          sortable: true,
          minWidth: 120,
        },
        {
          title: '上期得分率',
          key: 'previousDepScoreRate',
          render: (h, {row}) => {
            return h('p', row.previousDepScoreRate ? `${ row.previousDepScoreRate }%` : '--');
          },
          minWidth: 100,
        }
      ],
      storeData: [],
      checkItemNumber: 1,
      checkItemTotal: 0,
      checkItemOrderType: 1,
      checkItemColumns: [
        {
          title: '排名',
          key: 'rank',
          minWidth: 60,
        },
        {
          title: '检查小类',
          key: 'name',
          render: (h, {row}) => {
            return h('p', row.name || '--');
          },
          minWidth: 160,
        },
        {
          title: '本期得分率',
          key: 'currentScoreRate',
          slot: 'currentScoreRate',
          sortable: true,
          minWidth: 120,
        },
        {
          title: '上期得分率',
          key: 'previousScoreRate',
          render: (h, {row}) => {
            return h('p', row.previousScoreRate ? `${ row.previousScoreRate }%` : '--');
          },
          minWidth: 100,
        }
      ],
      checkItemData: [],
      params: {},
      quickInput: '',
      poptipVisible: false,
      quickSearchId: '',
      quickSearchContent: []
    };
  },
  created(){
    this.enterpriseId = this.$system.$state.userInfo.groupId;
  },
  mounted(){
    this.initData();
  },
  destroyed(){
    localStorage.getItem('business_data') && localStorage.removeItem('business_data');
  },
  methods: {
    async initData(){
      if ( localStorage.getItem('business_data') ) {
        let _data = JSON.parse(localStorage.getItem('business_data'));
        this.formInline.currentDate = [_data.currentPeriodStartTime, _data.currentPeriodEndTime];
        this.formInline.preDate = [_data.previousPeriodStartTime, _data.previousPeriodEndTime];
        this.formInline.depIds = _data.orgIdList;
        this.department = _data.orgIdList.map((item, index) => {
          return {id: `O_${ item }`, name: _data.departName[index]};
        });
        this.departmentName = _data.departName;
        this.mixedDefaultData = {orgs: this.department};
        this.search();
      } else {
        await this.getOrgListData();
        await this.initDate();
      }
    },
    // 初始化日期
    initDate(){
      api.getLatelyReportMonth().then(res => {
        if ( !res.currentPeriod ) {
          return this.$Message.error('本期暂无数据！');
        }
        if ( res.previousPeriod ) {
          // 上期
          this.formInline.preDate = [
            moment(`${ res.previousPeriod }-01`).format('YYYY-MM-DD'),
            moment(
              `${ res.previousPeriod }-${ moment(res.previousPeriod, 'YYYY-MM').daysInMonth() }`
            ).format('YYYY-MM-DD')
          ];
        } else {
          this.formInline.preDate = [];
        }
        if ( res.currentPeriod ) {
          // 本期
          let startTime = moment(`${ res.currentPeriod }-01`).format('YYYY-MM-DD');
          let endTime = moment(
            `${ res.currentPeriod }-${ moment(res.currentPeriod, 'YYYY-MM').daysInMonth() }`
          ).format('YYYY-MM-DD');
          let _diffDays = moment(endTime).diff(moment(startTime), 'days');
          let preStartTime = moment(startTime)
            .subtract(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          let preEndTime = moment(endTime)
            .subtract(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          this.formInline.currentDate = [startTime, endTime];
          this.formInline.preDate = [preStartTime, preEndTime];

        } else {
          this.formInline.currentDate = [];
        }
        this.depNames = '';
        this.search();
      });
    },
    search(){
      this.params = this.getParamsData();
      localStorage.setItem('business_data', JSON.stringify({...this.params, departName: this.departmentName}));
      // 数据总览
      this.getReviewData();
      // 暗访门店分布
      this.getAgentDepDistributionData();
      // 暗访门店占比
      this.getAgentDepByOrgData();
      // 部门得分对比
      this.getOrgMarkCompareData(1);
      // 报告等级分布
      this.getDepRankDistributionData();
      // 检查项大类得分对比 默认平均得分率
      this.getTemplateOrParentTemplateMarkData(1);
      // 客户满意度
      this.getOrgClientSatisfyScoreData();
      // 得分率/满意度落点分布
      this.getOrgOrDepClientSatisfyScoreAndAverageScoreData(1);
      // 门店排名
      this.getDepRankData();
      // 小类排名
      this.getPublicOpinionAnalysisData();
    },
    reset(){
      localStorage.getItem('business_data') && localStorage.removeItem('business_data');
      this.metricsList = defaultMetrics;
      this.cartsList = JSON.parse(JSON.stringify(cartsList));
      this.metricsFlag = false;
      this.depNames = '';
      this.formInline = {
        currentDate: [],
        preDate: [],
        depIds: []
      };
      this.$refs.quickSearchRef.quickSearch = '';
      this.initData();
    },
    exportPdf(){
      const pdfLoader = new exportFile.PdfLoader(this.$refs.containerRef, {
        fileName: "企业概览",
      });
      pdfLoader.getPdf().then((res) => {
        console.log("[ 导出成功] >", res);
        this.$Message.success('导出成功！');
      });
    },
    getQuickSearchParams(payload){
      let {
        currentPeriodEndTime,
        currentPeriodStartTime,
        orgIdList,
        departName,
        previousPeriodEndTime,
        previousPeriodStartTime
      } = payload.content;
      this.formInline.currentDate = [currentPeriodStartTime, currentPeriodEndTime];
      this.formInline.preDate = [previousPeriodStartTime, previousPeriodEndTime];
      this.formInline.depIds = orgIdList;
      this.department = orgIdList.map((item, index) => {
        return {id: `O_${ item }`, name: departName[index]};
      });
      this.departmentName = departName;
      this.mixedDefaultData = {orgs: this.department};
      this.search();
    },
    getQuickSearchData(payload){
      this.quickSearchId = payload.id;
      this.quickSearchContent = JSON.parse(payload.content);
    },
    quickSaveHandle(){
      if ( !this.quickInput.trim() ) {
        return this.$Message.error('请输入筛选条件名称！');
      }
      if ( this.quickSearchContent.filter(item => item.name == this.quickInput).length > 0 ) return this.$Message.error('筛选条件名称已存在！');
      let _search = this.getParamsData();
      let params = {
        id: this.quickSearchId,
        content: JSON.stringify([
          ...this.quickSearchContent,
          {..._search, name: this.quickInput, departName: this.departmentName}]),
      };
      api.updateSearchCondition(params).then(res => {
        this.$Message.success('保存成功！');
        this.quickCancelHandle();
        this.$refs.quickSearchRef.quickSearch = '';
        this.$refs.quickSearchRef.getQuickSearch();
      });
    },
    quickCancelHandle(){
      this.poptipVisible = false;
      this.quickInput = '';
    },
    getAgentDepDistributionData(){
      let params = this.getParamsData();
      delete params.previousPeriodStartTime;
      delete params.previousPeriodEndTime;
      api
        .getAgentDepDistribution(params)
        .then(res => {
          if ( res ) {
            this.mapMarkersData = res;
            this.storeMapChart();
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getAgentDepByOrgData(){
      let params = this.getParamsData();
      delete params.previousPeriodStartTime;
      delete params.previousPeriodEndTime;
      api
        .getAgentDepByOrg(params)
        .then(res => {
          if ( Array.isArray(res) && res.length ) {
            let total = 0;
            res.forEach(item => {
              item.name = item.key;
              total += Number(item.value);
            });
            let _temp = JSON.parse(JSON.stringify(res));
            _temp.sort((a, b) => {
              return b.value - a.value;
            });
            let storeNameObj = _temp[0];
            let storeRate = ((storeNameObj.value / total) * 100).toFixed(2) + '%';
            this.storeText = `本期【${ storeNameObj.key }】暗访门店占比最高，共有 ${ storeNameObj.value } 家，占比${ storeRate }`;
            this.ratePieChart.data = res || [];
            this.ratePieChart.options.series[0].data = res || [];
          } else {
            this.storeText = '本期暂无数据！';
            this.ratePieChart.options.series[0].data = res || [];
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getOrgMarkCompareData(type = 1){
      let params = this.getParamsData();
      api
        .getOrgMarkCompare(params)
        .then(res => {
          if ( res.orgNameList && res.orgNameList.length > 0 ) {
            let _temp = this.depRateChart;
            _temp.orgNameList = res.orgNameList || [];
            _temp.currentAverageScore = res.currentAverageScore || '';
            _temp.currentAverageScoreScale = res.currentAverageScoreScale || '';
            _temp.currentScoreList = res.currentScoreList || [];
            _temp.previousScoreList = res.previousScoreList || [];
            _temp.currentScoreScaleList = res.currentScoreScaleList || [];
            _temp.previousScoreScaleList = res.previousScoreScaleList || [];
            _temp.defScoreList = res.defScoreList || [];
            _temp.defScoreScaleList = res.defScoreScaleList || [];
            this.depRateChart = _temp;
            this.depScoreRateChart(type);
          } else {
            this.depText = '本期暂无数据！';
            this.depRateChart.data = [];
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getDepRankDistributionData(){
      let params = this.getParamsData();
      delete params.previousPeriodStartTime;
      delete params.previousPeriodEndTime;
      api
        .getDepRankDistribution(params)
        .then(res => {
          if ( res.orgNameList && res.orgNameList.length ) {
            this.storeLevelPieChart.orgNameList = res.orgNameList;
            this.storeLevelPieChart.orgScoreShiftVoList = res.orgScoreShiftVoList || [];
            this.storeLevelPieChart.scoreShiftVoList = res.scoreShiftVoList || [];
            this.storeChart();
          } else {
            this.reportLevelText = '本期暂无数据！';
            // this.storeLevelPieChart.chartRef.clear();
            // this.storeLevelBarChart.chartRef.clear();
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getTemplateOrParentTemplateMarkData(type = 1){
      let param = this.getParamsData();
      let params = {
        ...param,
        loseMarkType: 2,//1-小类，2-大类
        filterNoMark: 1, // 非0 数据
      };
      this.params = params;
      api
        .getTemplateOrParentTemplateMark(params)
        .then(res => {
          if ( res.nameList && res.nameList.length ) {
            let _temp = this.checkItemChart;
            _temp.nameList = res.nameList || [];
            _temp.currentPeriod = res.currentPeriod || [];
            _temp.previousPeriod = res.previousPeriod || [];
            _temp.currentAverageScore = res.currentAverageScore || 0;
            _temp.currentAverageScoreScale = res.currentAverageScoreScale || 0;
            _temp.defScoreScaleList = res.defScoreScaleList || [];
            _temp.defScoreList = res.defScoreList || [];
            this.checkItemChart = _temp;
            this.checkItemBarChart(type);
          } else {
            this.checkItemText = '本期暂无数据！';
            // this.checkItemChart.chartRef.clear();
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getOrgClientSatisfyScoreData(){
      let params = this.getParamsData();
      api
        .getOrgClientSatisfyScore(params)
        .then(res => {
          if ( res.orgNameList && res.orgNameList.length ) {
            let _temp = this.customerBarChart;
            _temp.currentOrgScoreList = res.currentOrgScoreList || [];
            _temp.previousOrgScoreList = res.previousOrgScoreList || [];
            _temp.currentAverageScore = res.currentAverageScore || 0;
            _temp.defCurrentAverageScore = res.defCurrentAverageScore || 0;
            _temp.orgNameList = res.orgNameList || [];
            _temp.defScoreList = res.defScoreList || [];
            _temp.choiceNumList = res.choiceNumList || [];
            this.customerBarChart = _temp;
            this.customerChart();
          } else {
            this.customText = '本期暂无数据！';
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getDepRankData(){
      let params = this.getParamsData();
      params.orderType = this.storeOrderType;
      params.pageSize = this.pageSize;
      params.pageNumber = this.storeNumber;
      api
        .getDepRank(params)
        .then(res => {
          this.storeTotal = res.total;
          this.storeData = res.records.map(item => {
            if ( item.previousDepScoreRate != null ) {
              item._diff = Number(item.currentDepScoreRate) - Number(item.previousDepScoreRate);
            } else {
              item._diff = null;
            }
            return item;
          });
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getOrgOrDepClientSatisfyScoreAndAverageScoreData(type = 1){
      let params = this.getParamsData();
      delete params.previousPeriodStartTime;
      delete params.previousPeriodEndTime;
      api.getOrgOrDepClientSatisfyScoreAndAverageScore(params).then(res => {
        if ( res.orgNameList && res.orgNameList.length ) {
          let _temp = this.cursorChart;
          _temp.averageScoreScale = res.averageScoreScale || 0;
          _temp.averageClientSatisfyScore = res.averageClientSatisfyScore || 0;
          _temp.orgScoreScaleList = res.orgScoreScaleList || [];
          _temp.orgClientSatisfyScoreList = res.orgClientSatisfyScoreList || [];
          _temp.orgNameList = res.orgNameList || [];
          _temp.depNameList = res.depNameList || [];
          _temp.depScoreScaleList = res.depScoreScaleList || [];
          _temp.depClientSatisfyScoreList = res.depClientSatisfyScoreList || [];
          _temp.averageScoreList = res.averageScoreList || [];
          _temp.averageScoreScaleList = res.averageScoreScaleList || [];
          this.cursorChart = _temp;
          this.cursorChartData(type);
        } else {
          // this..cursorChart.chartRef.clear();
        }

      }).catch(e => {
        this.$Message.error(e.result);
      });
    },
    getPublicOpinionAnalysisData(){
      let params = this.getParamsData();
      params.loseMarkType = 1; //1-小类，2-大类
      params.orderType = this.checkItemOrderType; //0-升序，1-降序
      params.pageSize = this.pageSize;
      params.pageNumber = this.checkItemNumber;
      this.params = params;
      api
        .getTemplateOrParentRank(params)
        .then(res => {
          this.checkItemTotal = res.total;
          this.checkItemData = res.records.map(item => {
            if ( item.previousScoreRate != null ) {
              item._diff = item.currentScoreRate - item.previousScoreRate;
            } else {
              item._diff = null;
            }
            return item;
          });
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getReviewData(){
      let params = this.getParamsData();
      api
        .getEnterpriseDataOverview(params)
        .then(res => {
          this.defPassTaskScale = res.defPassTaskScale;
          this.defAverageScoreScale = res.defAverageScoreScale;
          Object.keys(res).forEach(key => {
            this.cartsList.forEach(item => {
              if ( key == item.key ) {
                item[key] = res[key] || 0;
              }
              if ( key == item.diffKey ) {
                item[key] = res[key];
              }
              if ( item[item.diffKey] >= 0 ) {
                item.upOrDown = true;
              } else {
                item.upOrDown = false;
              }
            });
          });
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    // 指标切换
    metricsChange(data){
      if ( data.length < 5 ) return this.$Message.warning('至少显示5个指标');
      let _temp = JSON.parse(JSON.stringify(this.cartsList));
      _temp.forEach(item => {
        item.checked = false;
        data.forEach(val => {
          if ( item.name == val ) {
            item.checked = true;
          }
        });
      });
      this.cartsList = _temp;
      this.$forceUpdate();
    },
    // 时间选择
    timeInputClick(date, type){
      const [start, end] = date;
      let _diffDays = 0;
      let startTime = '',
        endTime = '',
        preStartTime = '',
        preEndTime = '';
      switch(type){
        case 1:
          startTime = moment(start).format('YYYY-MM-DD');
          endTime = moment(end).format('YYYY-MM-DD');
          _diffDays = moment(end).diff(moment(start), 'days');
          preStartTime = moment(start)
            .subtract(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          preEndTime = moment(end)
            .subtract(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          this.formInline.currentDate = [startTime, endTime];
          this.formInline.preDate = [preStartTime, preEndTime];
          break;
        case 2:
          preStartTime = moment(start).format('YYYY-MM-DD');
          preEndTime = moment(end).format('YYYY-MM-DD');
          _diffDays = moment(end).diff(moment(start), 'days');
          startTime = moment(start)
            .add(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          endTime = moment(end)
            .add(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          this.formInline.currentDate = [startTime, endTime];
          this.formInline.preDate = [preStartTime, preEndTime];
          break;
        default:
          break;
      }
      this.currentIndex = -1;
      this.showTimer = false;
    },
    // 门店分布
    storeMapChart(){
      let _temp = {};
      this.mapMarkersData.forEach(item => {
        if ( !_temp[item.divisionColor] ) {
          _temp[item.divisionColor] = {
            name: item.divisionName,
            value: item.divisionColor
          };
        }
      });
      this.mapLabelList = [];
      Object.keys(_temp).forEach(item => {
        this.mapLabelList.push(_temp[item]);
      });
      const infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),
      });
      let map = new AMap.Map('mapChart', {
        resizeEnable: true,
        center: [120.616562, 31.336895],
        zoom: 5
      });

      map.clearMap(); // 清除地图覆盖物
      let markers = [];
      this.mapMarkersData.forEach(item => {
        markers.push({
          icon: require(`@/assets/ico_${ item.divisionColor }.png`),
          position: [item.longitude, item.latitude],
          depName: item.depName,
          divisionName: item.divisionName,
        });
      });
      // 添加一些分布不均的点到地图上,地图上添加三个点标记，作为参照
      markers.forEach(item => {
        let marker = new AMap.Marker({
          map: map,
          icon: item.icon,
          position: [item.position[0], item.position[1]],
          offset: new AMap.Pixel(-13, -30)
        });
        marker.on('mouseover', function (e){
          infoWindow.setContent(
            `<div class="description">
              <h5 class="title">${ item.depName }</h5>
              <div class="mt-3 detail">
                等级：${ item.divisionName }<br />
              </div>
            </div>`
          );
          infoWindow.open(map, [item.position[0], item.position[1]]);
        });
        marker.on('mouseout', function (e){
          infoWindow.close(map, [item.position[0], item.position[1]]);
        });
      });
    },
    // 部门得分对比
    depScoreRateChart(type){
      const {
        optionsFn,
        options,
        orgNameList,
        currentAverageScore,
        currentAverageScoreScale,
        currentScoreList,
        previousScoreList,
        currentScoreScaleList,
        previousScoreScaleList,
        defScoreList,
        defScoreScaleList
      } = this.depRateChart;
      let option = optionsFn({...this, orgNameList});
      let _data = [], _dataRate = [], _averageData = [];
      orgNameList.forEach((item, index) => {
        _data.push({
          key: item,
          value: currentScoreScaleList[index] || 0,
          diffValue: defScoreScaleList[index] || 0,
        });
        _dataRate.push({
          key: item,
          value: defScoreScaleList[index] || 0,
        });
      });
      _data.sort((a, b) => {
        return b.value - a.value;
      });
      _dataRate.sort((a, b) => {
        return b.value - a.value;
      });
      this.depScoreMax = _data[0];
      this.depScoreMin = _data[_data.length - 1];
      this.depScoreChainMax = _dataRate[0];
      this.depScoreChainMin = _dataRate[_dataRate.length - 1];
      this.depText = `本期【${ this.depScoreMax.key }】的平均得分率最高，环比上期增长了 ${ this.depScoreMax.diffValue }%,【${ this.depScoreMin.key }】的平均得分率最低，环比上期下降了${ Math.abs(this.depScoreMin.diffValue) }%；环比上期，【${ this.depScoreChainMax.key }】的平均得分率增幅最大，增长了${ this.depScoreChainMax.value }%；【${ this.depScoreChainMin.key }】降幅最大，下降了${ Math.abs(this.depScoreChainMin.value) }%。`;
      option.xAxis.data = orgNameList;
      if ( type == 1 ) {
        option.series[0].data = currentScoreScaleList;
        option.series[0].name = '本期平均得分率';
        option.series[1].data = previousScoreScaleList;
        option.series[1].name = '上期平均得分率';
        option.yAxis[0].name = '平均得分率';
        option.yAxis[0].axisLabel = {formatter: '{value} %'};
        option.yAxis[1].axisLabel = {formatter: '{value} %'};
        option.series[2].data = defScoreScaleList;
        orgNameList.forEach(() => {
          _averageData.push(currentAverageScoreScale);
        });
        option.series[3].data = _averageData;
        option.series[3].name = '本期企业平均得分率';
      } else if ( type == 2 ) {
        option.series[0].data = currentScoreList;
        option.series[0].name = '本期平均得分';
        option.series[1].data = previousScoreList;
        option.series[1].name = '上期平均得分';
        option.yAxis[0].name = '平均得分';
        option.yAxis[0].axisLabel = {formatter: '{value}'};
        option.yAxis[1].axisLabel = {formatter: '{value}'};
        option.series[2].data = defScoreList;
        orgNameList.forEach(() => {
          _averageData.push(currentAverageScore);
        });
        option.series[3].data = _averageData;
        option.series[3].name = '本期企业平均得分';
      }
      this.depRateChart.options = option;
    },
    // 报告等级分布
    storeChart(){
      const {options, orgNameList, orgScoreShiftVoList, scoreShiftVoList} =
        this.storeLevelPieChart;
      let _pieData = [];
      _pieData = scoreShiftVoList.map((item, index) => {
        item.value = item.num;
        return item;
      });
      this.storeLevelPieChart.options.series[0].data = _pieData;
      let barOptionFn = this.storeLevelBarChart.barOptionFn;
      let barOptions = barOptionFn({...this, orgNameList});
      barOptions.xAxis.data = orgNameList;
      let _barData = [];
      // 报告总数
      let total = 0;
      let _totalArr = [];
      orgNameList.forEach((item, index) => {
        let _t = 0;
        orgScoreShiftVoList.forEach((item, i) => {
          _t += item.orgTaskNum[index];
        });
        _totalArr.push(_t);
      });
      _barData = orgScoreShiftVoList.map(item => {
        let _data = [];
        item.orgTaskNum.forEach((el, i) => {
          if ( _totalArr[i] == 0 ) {
            _data.push(0.00);
          } else {
            _data.push((el / _totalArr[i] * 100).toFixed(2));
          }
        });
        item.type = 'bar';
        item.barWidth = '12';
        item.stack = '总量';
        item.data = _data;
        return item;
      });
      scoreShiftVoList.forEach(item => {
        total += Number(item.num);
      });
      let _subNum = scoreShiftVoList[scoreShiftVoList.length - 1] && scoreShiftVoList[scoreShiftVoList.length - 1].num;
      let reportLevelTotal = _subNum;
      let reportLastLevelRate = '0.00%';
      if ( total != 0 ) {
        reportLastLevelRate = ((_subNum / total) * 100).toFixed(2) + '%';
      }
      this.reportLevelText = `本期整体不合格报告共有${ reportLevelTotal }份，不合格率为 ${ reportLastLevelRate }`;
      barOptions.series = _barData;
      this.storeLevelBarChart.options = barOptions;
    },
    // 检查项大类得分对比
    checkItemBarChart(type){
      let _rate1 = [], _rate2 = [];
      let _score1 = [], _score2 = [];
      const {
        optionsFn,
        nameList,
        currentPeriod,
        previousPeriod,
        defScoreList,
        defScoreScaleList,
        currentAverageScore,
        currentAverageScoreScale,
      } = this.checkItemChart;
      let option = optionsFn({...this, nameList});
      option.xAxis.data = nameList;
      let _data = [], _dataRate = [], _averageData = [];
      nameList.forEach((item, index) => {
        _data.push({ //得分率环比
          key: item,
          value: defScoreScaleList[index] || 0,
        });

        _dataRate.push({
          key: item,//得分率
          value: currentPeriod[index].scoreRate || 0,
          diffValue: defScoreScaleList[index] || 0,//得分率环比
        });
      });
      _data.sort((a, b) => {
        return b.value - a.value;
      });
      this.checkItemScoreMax = _data[0];
      this.checkItemScoreMin = _data[_data.length - 1];
      _dataRate.sort((a, b) => {
        return b.value - a.value;
      });
      this.checkItemChainMax = _dataRate[0];
      this.checkItemChainMin = _dataRate[_dataRate.length - 1];
      let text1 = '', text2 = '';
      if ( this.checkItemScoreMax.value > 0 ) {
        text1 = `【${ this.checkItemScoreMax.key }】大类的平均得分率增幅最大，增长了${ this.checkItemScoreMax.value }%`;
      } else if ( this.checkItemScoreMax.value < 0 ) {
        text1 = `【${ this.checkItemScoreMin.key }】大类的平均得分率降幅最大，下降了${ Math.abs(this.checkItemScoreMin.value) }%`;
      }
      if ( this.checkItemScoreMax.value > 0 && this.checkItemScoreMin.value < 0 ) {
        text2 = `【${ this.checkItemScoreMax.key }】大类的平均得分率增幅最大，增长了${ this.checkItemScoreMax.value }%；【${ this.checkItemScoreMin.key }】大类的平均得分率降幅最大，下降了${ Math.abs(this.checkItemScoreMin.value) }%`;
      }

      this.checkItemText = `本期【${ this.checkItemChainMax.key }】大类的平均得分率最高，环比上期${ this.checkItemChainMax.diffValue > 0 ? '增长' : '下降' }了${ Math.abs(this.checkItemChainMax.diffValue) }%,
      ${ this.checkItemChainMin.key }】大类的平均得分率最低，环比上期${ this.checkItemChainMin.diffValue > 0 ? "增长" : "下降" }了${ Math.abs(this.checkItemChainMin.diffValue) }%；
      环比上期，${ text1 }; ${ text2 }`;

      if ( type == 1 ) {
        // 平均得分率
        // 本期
        currentPeriod.forEach(item => {
          _rate1.push(item.scoreRate);
        });
        // 上期
        previousPeriod.forEach(item => {
          _rate2.push(item.scoreRate);
        });
        option.series[0].data = _rate1;
        option.series[0].name = '本期平均得分率';
        option.series[1].data = _rate2;
        option.series[1].name = '上期平均得分率';
        option.yAxis[0].name = '平均得分率';
        option.yAxis[0].axisLabel = {formatter: '{value} %'};
        option.yAxis[1].axisLabel = {formatter: '{value} %'};
        option.series[2].data = defScoreScaleList;
        nameList.forEach((item, index) => {
          _averageData.push(currentAverageScoreScale);
        });
        option.series[3].data = _averageData;
        option.series[3].name = '本期企业平均得分率';
      } else if ( type == 2 ) {
        // 平均得分
        currentPeriod.forEach(item => {
          _score1.push(item.mark);
        });
        // 上期
        previousPeriod.forEach(item => {
          _score2.push(item.mark);
        });
        option.series[0].data = _score1;
        option.series[0].name = '本期平均得分';
        option.series[1].data = _score2;
        option.series[1].name = '上期平均得分';
        option.yAxis[0].name = '平均得分';
        option.yAxis[0].axisLabel = {formatter: '{value}'};
        option.yAxis[1].axisLabel = {formatter: '{value}'};
        option.series[2].data = defScoreList;
        nameList.forEach((item, index) => {
          _averageData.push(currentAverageScore);
        });
        option.series[3].data = _averageData;
        option.series[3].name = '本期企业平均得分';
      }
      this.checkItemChart.options = option;
    },
    // 客户满意度
    customerChart(){
      const {
        optionsFn,
        currentOrgScoreList,
        previousOrgScoreList,
        defScoreList,
        currentAverageScore,
        defCurrentAverageScore,
        orgNameList,
        choiceNumList
      } = this.customerBarChart;
      let barOptions = optionsFn({...this, orgNameList});
      barOptions.xAxis.data = orgNameList;
      barOptions.series[0].data = currentOrgScoreList;
      barOptions.series[1].data = previousOrgScoreList;
      barOptions.series[2].data = defScoreList;

      let _temp = [], _tempRate = [];
      orgNameList.forEach((item, index) => {
        _temp.push({
          key: item,
          value: currentOrgScoreList[index],
        });
        _tempRate.push({
          key: item,
          value: defScoreList[index],
        });
      });
      _temp.sort((a, b) => {
        return b.value - a.value;
      });
      _tempRate.sort((a, b) => {
        return b.value - a.value;
      });
      let _tempRateMin = _tempRate[_tempRate.length - 1];
      let _max = _temp[0];
      let _min = _temp[_temp.length - 1];

      this.customText = `本期${ _max.key }的客户满意度评分最高，${ _min.key }最低`;
      this.customerBarChart.options= barOptions;
    },
    cursorChartData(type){
      const {
        lineOptions,
        orgScoreScaleList,
        orgClientSatisfyScoreList,
        orgNameList,
        depNameList,
        depScoreScaleList,
        depClientSatisfyScoreList,
        averageScoreScale,
        averageClientSatisfyScore,
      } = this.cursorChart;
      let _depScoreList = [], _depRateList = [], _orgScoreList = [], _orgRateList = [], _averageScoreScale = [],
        _averageClientSatisfyScore = [];
      lineOptions.series[0].markLine.data[0].xAxis = averageClientSatisfyScore;
      lineOptions.series[0].markLine.data[1].yAxis = averageScoreScale;
      // 点图
      if ( this.scatterRadio == 1 ) { // 部门
        orgNameList.forEach((item, index) => {
          _depScoreList.push({
            name: item,
            value: [orgClientSatisfyScoreList[index], orgScoreScaleList[index]]
          });
        });
        lineOptions.series[0].data = _depScoreList;
      } else {
        // 门店
        depNameList.forEach((item, index) => {
          _orgScoreList.push({
            name: item,
            value: [depClientSatisfyScoreList[index], depScoreScaleList[index]]
          });
        });
        lineOptions.series[0].data = _orgScoreList;
      }
      console.log('lineOptions',lineOptions);
      this.cursorChart.options = lineOptions;
    },
    cursorChartBarData(type){
      const {
        barOptions,
        orgScoreScaleList,
        orgClientSatisfyScoreList,
        orgNameList,
        depNameList,
        depScoreScaleList,
        depClientSatisfyScoreList,
        averageScoreScale,
        averageClientSatisfyScore,
      } = this.cursorChart;
      let _depScoreList = [], _depRateList = [], _orgScoreList = [], _orgRateList = [];
      if ( this.scatterRadio == 1 ) { // 部门
        barOptions.xAxis.data = orgNameList;
        barOptions.series[0].data = orgScoreScaleList;
        barOptions.series[1].data = orgClientSatisfyScoreList;
      } else { // 门店
        barOptions.xAxis.data = depNameList;
        barOptions.series[0].data = depScoreScaleList;
        barOptions.series[1].data = depClientSatisfyScoreList;
      }
      this.cursorChart.options= barOptions;
    },
    /**
     *
     * @param {*} type  图表类比
     * @param {*} index 图表展示类比
     */
    radioChange(type, index){
      switch(type){
        case 1:
          this.depRadio = index;
          this.depScoreRateChart(index);
          break;
        case 2:
          this.checkItemRadio = index;
          this.checkItemBarChart(index);
          break;
        case 3:
          this.scatterRadio = index;
          if ( this.currentChart == 1 ) {
            // 散点图
            this.cursorChartData(this.scatterRadio);
          } else {
            // 柱状图
            this.cursorChartBarData(this.currentChart);
          }
          break;

        default:
          break;
      }
    },
    changeChartType(type){
      this.currentChart = type;
      if ( type == 1 ) {
        this.cursorChartData(this.scatterRadio);
      } else {
        this.cursorChartBarData(this.scatterRadio);
      }
    },
    storeSortChange({order}){
      order == 'desc' ? this.storeOrderType = 1 : this.storeOrderType = 0;
      this.storeNumber = 1;
      this.getDepRankData();
    },
    storePageChange(val){
      this.storeNumber = val;
      this.getDepRankData();
    },
    itemSortChange({order}){
      order == 'desc' ? this.checkItemOrderType = 1 : this.checkItemOrderType = 0;
      this.checkItemNumber = 1;
      this.getPublicOpinionAnalysisData();
    },
    itemPageChange(val){
      this.checkItemNumber = val;
      this.getPublicOpinionAnalysisData();
    },
    getParamsData(){
      let {currentDate, preDate, depIds} = this.formInline;
      if ( depIds.length == 0 ) {
        this.defaultDepList.forEach(item => {
          depIds.push(item.id.split('_')[1]);
        });
      }
      let params = {
        currentPeriodStartTime: currentDate[0] ? moment(currentDate[0]).format('YYYY-MM-DD') : '',
        currentPeriodEndTime: currentDate[1] ? moment(currentDate[1]).format('YYYY-MM-DD') : '',
        previousPeriodStartTime: preDate[0] ? moment(preDate[0]).format('YYYY-MM-DD') : '',
        previousPeriodEndTime: preDate[1] ? moment(preDate[1]).format('YYYY-MM-DD') : '',
        orgIdList: depIds
      };
      return params;
    },
    /**
     * 部门
     */
    getDepCheckedData(data){
      let orgs =
        data.orgs &&
        data.orgs.map(i => {
          return {
            name: i.name,
            id: i.id
          };
        });
      this.mixedDefaultData = data;
      this.department = [...orgs];
      this.formInline.depIds = this.department.map(i => i.id.split('_')[1]);
      this.departmentName = this.department.map(i => i.name);
    },
    // 获取默认顶层部门
    async getOrgListData(){
      let params = {
        groupId: this.enterpriseId,
        keyword: '',
        showType: 4,
        showShopCount: true
      };
      try {
        let res = await api.getOrganizesTrees(params);
        this.defaultDepList = res;
        this.mixedDefaultData = {orgs: this.defaultDepList};
        this.departmentName = this.defaultDepList.map(item => item.name);
      } catch(error){
        // console.log('error', error);
      }
    },
    downloadHandle(type){
      let params = this.getParamsData();
      switch(type){
        case 'mapChart':
          api.exportAgentDepDistributionExcel(params).then(res => {
            downloadFile('暗访门店分布.xlsx', res.data);
          });
          break;
        case 'store':
          this.params.orderType = this.storeOrderType;
          this.params.pageSize = this.pageSize;
          this.params.pageNumber = this.storeNumber;
          api.exportDepRankExcel(this.params).then(res => {
            downloadFile('门店排名.xlsx', res.data);
          });
          break;
        case 'subItem':
          this.params.loseMarkType = 1; //1-小类，2-大类
          this.params.orderType = this.checkItemOrderType; //0-升序，1-降序
          this.params.pageSize = this.pageSize;
          this.params.pageNumber = this.checkItemNumber;
          api.exportTemplateRankExcel(this.params).then(res => {
            downloadFile('检查小类排名.xlsx', res.data);
          });
          break;
        default:
          break;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  box-sizing: border-box;
  padding: 0 12px 0 0;

  .header {
    background: #fff;
    border-radius: 0 0 6px 6px;

    .title {
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      padding: 10px 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      font-size: 18px;
      line-height: 29px;
      color: #333333;
    }

    .search {
      box-sizing: border-box;
      padding: 10px 16px;

      ::v-deep .ivu-form {
        .ivu-form-item {
          margin-bottom: 18px;
        }

        .ivu-form-item-label {
          text-align: left;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
        }
      }

      .form-item-btn {
        margin: 0 10px;
      }
    }
  }

  .container {
    margin-top: 12px;

    .box {
      box-sizing: border-box;
      padding: 16px;
      background: #ffffff;
      border-radius: 6px;
      margin-bottom: 12px;

      .box-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        .title {
          width: 80%;
          font-family: PingFangSC-SNaNpxibold;
          font-weight: 600;
          font-size: 14px;
          color: #333333;
          line-height: 32px;
        }

        .btn, .btn-box {
          display: flex;
          position: relative;

          .btn-list {
            display: none;
          }

          &:hover .btn-list {
            display: block;
          }

          .chart-radio {
            background: #f0f0f0;
            border-radius: 6px;
            box-sizing: border-box;
            padding: 2px;
            display: flex;
            align-items: center;
            margin-right: 12px;
          }

          .chart-icon {
            padding: 0 10px;

            .chart-img {
              width: 25px;
              height: 25px;
              border-radius: 5px;
              padding: 5px;
              cursor: pointer;
            }

            .current-chart {
              background: #fff;
            }
          }

          .chart-btn {
            height: 28px;
            box-sizing: border-box;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            font-family: PingFangSC-Medium;
            font-size: 12px;
            color: #7f7f7f;
            letter-spacing: 0;
            text-align: center;
            cursor: pointer;

            &.active-radio {
              font-weight: 500;
              color: #000000;
              background: #ffffff;
            }
          }

          .default-icon {
            width: 16px;
            height: 16px;
            margin-left: 10px;
            cursor: pointer;
          }
        }

        .btn-option {
          position: relative;

          .metrics-list {
            position: absolute;
            top: 35px;
            left: -50px;
            box-sizing: border-box;
            padding: 8px 16px;
            min-width: 200px;
            height: 220px;
            z-index: 100;

            &::-webkit-scrollbar {
              display: none;
              /* Chrome Safari */
            }

            scrollbar-width: none;
            /* firefox */
            -ms-overflow-style: none;
            /* IE 10+ */
            overflow-x: hidden;
            overflow-y: auto;
            background: #fff;
            box-shadow: 0 0 6px 0 #0000001a;
            border-radius: 6px;

            .ivu-checkbox-group {
              display: block;
            }

            .item {
              font-family: PingFangSC-Regular;
              font-weight: 400;
              font-size: 13px;
              color: #333333;
              line-height: 32px;
            }
          }
        }
      }

      .box-desc {
        background: #fffdf5;
        box-sizing: border-box;
        padding: 9px 16px;
        margin-bottom: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0;
        line-height: 22px;
      }

      .box-cards {
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding-left: 22px;

        .card {
          flex: 0 0 18.4%;
          margin: 0 22px 12px 0;
          box-sizing: border-box;
          padding: 16px;
          background: #f5f7fa;
          border-radius: 8px;


          &:last-child {
            margin-right: 0;
          }

          .card-title {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 14px;
            color: #333333;

            span {
              margin-right: 8px;
            }
          }

          .card-num {
            font-family: PingFangSC-Medium;
            font-weight: 500;
            font-size: 28px;
            color: #000000;
            letter-spacing: 0;
            line-height: 36px;
            margin: 7px 0 9px 0;

            .card-num-percent {
              font-size: 12px;
            }
          }

          .card-rate {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 12px;
            color: #7f7f7f;
            line-height: 16px;

            .rate {
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: #ff1111;
            }

            .rate-down {
              color: #00c7a6;
            }

            span {
              margin-right: 4px;
            }
          }
        }

        .cart-item {
          display: none;
        }
      }

      .charts {
        .charts-label {
          height: 30px;
          display: flex;
          align-items: center;
          margin: 6px 0;
          /* line-height: 20px; */

          p {
            display: flex;
            align-items: center;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 12px;
            color: #7f7f7f;
            margin-right: 8px;
          }

          span {
            width: 8px;
            height: 8px;
            background: #53a5ff;
            border-radius: 2px;
            margin-right: 6px;
          }
        }
      }
    }

    .box-sub {
      margin-top: 12px;
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .box {
        width: 50%;
        margin-right: 12px;
        margin-bottom: 0;

        &:last-child {
          margin-right: 0;
        }

        .box-desc {
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .table-box {
      }
    }

    .charts-box {
      display: flex;

      .chart {
        margin-right: 12px;
        margin-bottom: 0;

        &:last-child {
          margin-right: 0;
        }
      }

      .pie-chart {
        width: 30%;
      }

      .bar-chart {
        flex: 1;
      }
    }

  }

  .search-btn {
    display: flex;
    align-items: center;

    .quick-save {
      background: rgba(255, 153, 0, .0588235294);
      border-radius: 24px 0 6px 0;
      margin-left: 20px;
      font-weight: 400;
      font-size: 13px;
      color: #f90;
      cursor: pointer;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 1px 5px;

      .ivu-icon {
        margin-right: 6px;
      }
    }

  }


}
</style>
<style lang="less">
.quick-input {
  p {
    margin: 8px 0;
  }

  .btn {
    text-align: right;

    .ivu-btn {
      margin-right: 10px;
    }
  }
}

.ivu-tooltip-inner {
  white-space: normal;
  max-width: max-content;
}

@media screen and (max-width: 1680px) {
  .card {
    flex: 0 0 17.5% !important;
  }
}

@media screen and (max-width: 1280px) {
  .card {
    flex: 0 0 17% !important;
  }
}

@media screen and (max-width: 1024px) {
  .card {
    flex: 0 0 16% !important;
  }
}

@media screen and (max-width: 950px) {
  .card {
    flex: 0 0 14% !important;
  }
}
</style>
:", <template>
  <div ref="containerRef" class="page-wrapper">
    <header class="header">
      <div class="title">企业概览</div>
      <div class="search">
        <quick-search ref="quickSearchRef" :quick-type="1" @quickSearch="getQuickSearchData"
                      @quickSearchParams="getQuickSearchParams"></quick-search>
        <Form ref="formInline" :label-width="80" :model="formInline" inline>
          <FormItem label="本期范围">
            <DatePicker v-model="formInline.currentDate" :clearable="false" :options="dateOptions" format="yyyy-MM-dd"
                        placeholder="本期时间范围" type="daterange" @on-change="timeInputClick($event, 1)">
            </DatePicker>
          </FormItem>
          <FormItem label="上期范围">
            <DatePicker v-model="formInline.preDate" :clearable="false" :options="dateOptions" format="yyyy-MM-dd"
                        placeholder="上期时间范围" type="daterange" @on-change="timeInputClick($event, 2)">
            </DatePicker>
          </FormItem>
          <FormItem label="部门选择">
            <!-- 部门 -->
            <department-select
              ref="department"
              :clearable="false"
              :containUnGroupTag="0"
              :enterprise-id="enterpriseId"
              :isAutoOrgTop="true"
              :mixedDefaultData="mixedDefaultData"
              :mixedSelection="true"
              :multiple="true"
              :showDepartment="false"
              :showSelectOrg="true"
              :showSelectTag="false"
              :value.sync="department"
              class="depart-select"
              placeholder="点击选择组织"
              @onCheckedData="getDepCheckedData"></department-select>
          </FormItem>
          <FormItem>
            <div class="search-btn">
              <Button class="form-item-btn" type="primary" @click="search">查询</Button>
              <Button class="form-item-btn" @click="reset">重置</Button>
              <Button class="form-item-btn" @click="exportPdf">导出pdf</Button>
              <Poptip v-model="poptipVisible" placement="bottom" width="300">
                <p class="quick-save">
                  <Icon type="ios-folder-outline"/>
                  保存筛选条件
                </p>
                <div slot="content" class="quick-input">
                  <p><Input v-model="quickInput" :maxlength="20" :show-word-limit="true"/></p>
                  <p class="btn">
                    <Button @click="quickCancelHandle">取消</Button>
                    <Button type="primary" @click="quickSaveHandle">保存</Button>
                  </p>
                </div>
              </Poptip>
            </div>
          </FormItem>
        </Form>
      </div>
    </header>
    <div class="container">
      <!-- 数据概览 -->
      <div class="box">
        <div class="box-header">
          <p class="title">数据总览</p>
          <div class="btn btn-option">
            <Button @click="metricsFlag = !metricsFlag">指标选择</Button>
            <div v-show="metricsFlag" class="metrics-list">
              <CheckboxGroup v-model="metricsList" @on-change="metricsChange">
                <p v-for="(item, index) in cartsList" :key="index" class="item">
                  <Checkbox :label="item.name">{{ item.name }}</Checkbox>
                </p>
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <div v-if="defPassTaskScale != null || defAverageScoreScale != null" class="box-desc">
          <span v-if="defPassTaskScale != null">本期暗访门店合格率环比上期呈{{ defPassTaskScale >= 0 ? '上升' : '下降'
            }}趋势，{{
              defPassTaskScale >= 0 ? `上升了${ defPassTaskScale }%` : `下降了${ Math.abs(defPassTaskScale) }%`
            }}；</span>
          <span v-if="defAverageScoreScale != null">平均得分率较上期同样呈{{ defAverageScoreScale >= 0 ? '上升' : '下降'
            }}趋势，{{
              defAverageScoreScale >= 0
                ? `上升了${ defAverageScoreScale }%`
                : `下降了${ Math.abs(defAverageScoreScale) }%`
            }}</span>
        </div>
        <div class="box-cards">
          <div v-for="item in cartsList" :key="item.name" :class="!item.checked ? 'cart-item' : ''" class="card">
            <p class="card-title">
              <span>{{ item.name }}</span>
              <Tooltip :content="item.tip" placement="top-start">
                <SvgIcon icon-class="help"></SvgIcon>
              </Tooltip>
            </p>
            <p class="card-num">{{ item[item.key] == null ? '--' : `${ item[item.key] }` }} <span
              v-if="item[item.key] != null && item.isPercent" class="card-num-percent">%</span></p>
            <p v-if="item[item.diffKey] != null" class="card-rate">
              <span>较上期</span>
              <span :class="!item.upOrDown ? 'rate-down' : ''" class="rate">
                {{ Math.abs(item[item.diffKey]) }} <span v-if="item.isPercent">%</span>
                <SvgIcon v-if="item[item.diffKey]!=0" :icon-class="item.upOrDown ? 'up' : 'down'" size="6"></SvgIcon>
              </span>
            </p>
          </div>
        </div>
      </div>
      <!-- 暗访门店分布 占比 -->
      <div class="box-sub">
        <div class="box">
          <div class="box-header">
            <p class="title">暗访门店分布
              <Tooltip content="报告等级：取后台门店得分率分档配置中的对应分档" placement="top-start">
                <SvgIcon icon-class="help"></SvgIcon>
              </Tooltip>
            </p>
            <div class="btn">
              <Button @click="downloadHandle('mapChart')">下载
                <SvgIcon icon-class="download"></SvgIcon>
              </Button>
            </div>
          </div>
          <div class="box-desc">本期暗访门店地域分布</div>
          <div class="charts">
            <div class="charts-label">
              <p v-for="(item,index) in mapLabelList" :key="index"><span :style="{background:`#${item.value}`}"></span>{{ item.name
                }}</p>
            </div>
            <div id="mapChart" ref="mapChart" style="height: 280px"></div>
          </div>
        </div>
        <ChartsBox :chart-desc="storeText"
                   :charts-obj="ratePieChart"
                   :down-excel="true"
                   :down-pic="true"
                   :search-params="params"
                   :tip-content="ratePieChart.tips"
                   chart-type="pie"
                   service="exportAgentDepByOrgExcel"
                   title="暗访门店占比">
        </ChartsBox>
      </div>
      <!-- 部门得分对比 -->
      <ChartsBox :chart-desc="depText"
                 :charts-obj="depRateChart"
                 :down-excel="true"
                 :down-pic="true"
                 :search-params="params"
                 :tip-content="depRateChart.tips"
                 chart-type="line"
                 service="exportOrgMarkCompareExcel"
                 title="部门得分对比">
        <template>
          <p class="chart-radio">
              <span :class="depRadio == 1 ? 'active-radio' : ''" class="chart-btn"
                    @click="radioChange(1, 1)">平均得分率</span>
            <span :class="depRadio == 2 ? 'active-radio' : ''" class="chart-btn"
                  @click="radioChange(1, 2)">平均得分</span>
          </p>
        </template>
      </ChartsBox>
      <!-- 报告等级分布 -->
      <ChartsBox :chart-desc="reportLevelText"
                 :charts-obj="storeLevelPieChart"
                 :otherChartsObj="storeLevelBarChart"
                 :down-excel="true"
                 :down-pic="true"
                 :search-params="params"
                 :tip-content="storeLevelPieChart.tips"
                 leftWidth="30%"
                 rigthWidth="70%"
                 service="exportDepRankDistributionExcel"
                 title="报告等级分布">
      </ChartsBox>
      <!-- 检查项大类得分对比 -->
      <ChartsBox :chart-desc="checkItemText"
                 :charts-obj="checkItemChart"
                 :down-excel="true"
                 :down-pic="true"
                 :search-params="params"
                 :tip-content="checkItemChart.tips"
                 service="exportParentTemplateCompareExcel"
                 title="检查项大类得分对比">
        <template>
          <p class="chart-radio">
              <span :class="checkItemRadio == 1 ? 'active-radio' : ''" class="chart-btn"
                    @click="radioChange(2, 1)">平均得分率</span>
            <span :class="checkItemRadio == 2 ? 'active-radio' : ''" class="chart-btn"
                  @click="radioChange(2, 2)">平均得分</span>
          </p>
        </template>
      </ChartsBox>

      <!-- 客户满意度 -->
      <ChartsBox :chart-desc="customText"
                 :charts-obj="customerBarChart"
                 :down-excel="false"
                 :down-pic="false"
                 :search-params="params"
                 :tip-content="customerBarChart.tips"
                 title="客户满意度">
      </ChartsBox>
      <ChartsBox chart-desc=""
                 :charts-obj="cursorChart"
                 :down-excel="true"
                 :down-pic="true"
                 :search-params="params"
                 :tip-content="cursorChart.tips"
                 service="exportOrgOrDepClientSatisfyScoreAndAverageScoreExcel"
                 title="得分率/满意度落点分布">
        <template>
          <p class="chart-radio">
            <span :class="scatterRadio == 1 ? 'active-radio' : ''" class="chart-btn"
                  @click="radioChange(3, 1)">部门</span>
            <span :class="scatterRadio == 2 ? 'active-radio' : ''" class="chart-btn"
                  @click="radioChange(3, 2)">门店</span>
          </p>
          <p class="chart-radio chart-icon">
            <img :class="currentChart == 1 ? 'current-chart' : ''" alt="" class="chart-img"
                 src="../../../assets/ico_chart_dian.png" @click="changeChartType(1)"/>
            <img :class="currentChart == 2 ? 'current-chart' : ''" alt="" class="chart-img"
                 src="../../../assets/ico_chart_zhu.png" @click="changeChartType(2)"/>
          </p>
        </template>
      </ChartsBox>
      <div class="box-sub">
        <div class="box">
          <div class="box-header">
            <p class="title">门店排名
              <Tooltip placement="top-start">
                <SvgIcon icon-class="help"></SvgIcon>
                <div slot="content">
                  <p>本期得分率： 本期时间范围内暗访总得分之和 / 本期时间范围内暗访总分之和</P>
                  <p>上期得分率： 上期时间范围内暗访总得分之和 / 上期时间范围内暗访总分之和</P>
                </div>
              </Tooltip>
            </p>
            <div class="btn">
              <Button @click="downloadHandle('store')">下载
                <SvgIcon icon-class="download"></SvgIcon>
              </Button>
            </div>
          </div>
          <div class="table-box">
            <Table :columns="storeColumn" :data="storeData" height="300" @on-sort-change="storeSortChange">
              <template slot="currentDepScoreRate" slot-scope="{row}">
                {{ row.currentDepScoreRate ? `${ row.currentDepScoreRate }%` : '--' }}
                <SvgIcon v-show="row._diff !=null && row._diff !=0"
                         :icon-class="row._diff>0?'ico_up':'ico_down'"></SvgIcon>
              </template>
            </Table>
            <Page :total="storeTotal" @on-change="storePageChange"/>
          </div>
        </div>
        <div class="box">
          <div class="box-header">
            <p class="title">检查小类排名</p>
            <div class="btn">
              <Button @click="downloadHandle('subItem')">下载
                <SvgIcon icon-class="download"></SvgIcon>
              </Button>
            </div>
          </div>
          <div class="table-box">
            <Table :columns="checkItemColumns" :data="checkItemData" height="300" @on-sort-change="itemSortChange">
              <template slot="currentScoreRate" slot-scope="{row}">
                {{ row.currentScoreRate ? `${ row.currentScoreRate }%` : '--' }}
                <SvgIcon v-show="row._diff !=null && row._diff !=0"
                         :icon-class="row._diff>0?'ico_up':'ico_down'"></SvgIcon>
              </template>
            </Table>
            <Page :total="checkItemTotal" @on-change="itemPageChange"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import api from '@/api/report-new';
import { exportAgentDepByOrgExcel, exportOrgMarkCompareExcel,exportDepRankDistributionExcel,exportParentTemplateCompareExcel,exportOrgOrDepClientSatisfyScoreAndAverageScoreExcel } from '@/api/report-new';
import exportFile from '@vensst/export-file';
import { downloadFile } from '@/utils/BaseUtil.js';
import { defaultMetrics,cartsList, ratePieChart, depRateChart,storeLevelPieChart, storeLevelBarChart,checkItemChart,customerBarChart,cursorChart  } from './config.js';
import BtnList from '../comps/index.vue';
import QuickSearch from '../comps/quick-search.vue';
import ChartsBox from '../comps/charts-box.vue';


export default {
  name: 'BusinessOverview',
  components: {
    BtnList,
    QuickSearch,
    // ErEcharts,
    ChartsBox,
  },
  data(){
    return {
      formInline: {
        currentDate: [],
        preDate: [],
        depIds: []
      },
      dateOptions: {
        disabledDate: date => {
          const _date = 365 * 24 * 3600 * 1000; // 12个月
          return date && date.valueOf() < Date.now() - _date;
        }
      },
      // 部门信息
      mixedDefaultData: {},
      department: [{}], // 门店信息,
      departmentName: [],
      enterpriseId: '',
      defaultDepList: [], // 默认顶层部门列表
      depNames: '',
      // 数据总览
      defPassTaskScale: 0,
      defAverageScoreScale: 0,
      metricsFlag: false,
      metricsList: defaultMetrics, //指标列表
      cartsList: JSON.parse(JSON.stringify(cartsList)),
      ratePieChart:ratePieChart,
      depRateChart:depRateChart,
      storeLevelPieChart:storeLevelPieChart,
      storeLevelBarChart:storeLevelBarChart,
      checkItemChart:checkItemChart,
      customerBarChart:customerBarChart,
      cursorChart:cursorChart,
      // cursorChart: null,
      mapMarkersData: [], // 地图标记数据
      mapLabelList: [],
      // 暗访门店占比
      storeText: '',

      // 部门得分对比
      depRadio: 1,
      depScoreMax: {key: '', diffValue: 0},
      depScoreMin: {key: '', diffValue: 0},
      depScoreChainMax: {key: '', value: 0},
      depScoreChainMin: {key: '', value: 0},
      depText: '',
      // 报告等级
      reportLevelText: '',

      // 检查项大类得分对比
      checkItemRadio: 1,
      checkItemScoreMax: {key: '', diffValue: 0},
      checkItemScoreMin: {key: '', diffValue: 0},
      checkItemChainMax: {key: '', value: 0},
      checkItemChainMin: {key: '', value: 0},
      checkItemText: '',

      // 满意度
      scatterRadio: 2,
      currentChart: 1,
      customText: '',

      pageSize: 10,
      storeNumber: 1,
      storeTotal: 0,
      storeOrderType: 1,
      storeColumn: [
        {
          title: '排名',
          key: 'rank',
          minWidth: 60,
        },
        {
          title: '门店名称',
          key: 'depName',
          render: (h, {row}) => {
            return h('p', row.depName || '--');
          },
          minWidth: 160,
        },
        {
          title: '本期得分率',
          key: 'currentDepScoreRate',
          slot: 'currentDepScoreRate',
          sortable: true,
          minWidth: 120,
        },
        {
          title: '上期得分率',
          key: 'previousDepScoreRate',
          render: (h, {row}) => {
            return h('p', row.previousDepScoreRate ? `${ row.previousDepScoreRate }%` : '--');
          },
          minWidth: 100,
        }
      ],
      storeData: [],
      checkItemNumber: 1,
      checkItemTotal: 0,
      checkItemOrderType: 1,
      checkItemColumns: [
        {
          title: '排名',
          key: 'rank',
          minWidth: 60,
        },
        {
          title: '检查小类',
          key: 'name',
          render: (h, {row}) => {
            return h('p', row.name || '--');
          },
          minWidth: 160,
        },
        {
          title: '本期得分率',
          key: 'currentScoreRate',
          slot: 'currentScoreRate',
          sortable: true,
          minWidth: 120,
        },
        {
          title: '上期得分率',
          key: 'previousScoreRate',
          render: (h, {row}) => {
            return h('p', row.previousScoreRate ? `${ row.previousScoreRate }%` : '--');
          },
          minWidth: 100,
        }
      ],
      checkItemData: [],
      params: {},
      quickInput: '',
      poptipVisible: false,
      quickSearchId: '',
      quickSearchContent: []
    };
  },
  created(){
    this.enterpriseId = this.$system.$state.userInfo.groupId;
  },
  mounted(){
    this.initData();
  },
  destroyed(){
    localStorage.getItem('business_data') && localStorage.removeItem('business_data');
  },
  methods: {
    async initData(){
      if ( localStorage.getItem('business_data') ) {
        let _data = JSON.parse(localStorage.getItem('business_data'));
        this.formInline.currentDate = [_data.currentPeriodStartTime, _data.currentPeriodEndTime];
        this.formInline.preDate = [_data.previousPeriodStartTime, _data.previousPeriodEndTime];
        this.formInline.depIds = _data.orgIdList;
        this.department = _data.orgIdList.map((item, index) => {
          return {id: `O_${ item }`, name: _data.departName[index]};
        });
        this.departmentName = _data.departName;
        this.mixedDefaultData = {orgs: this.department};
        this.search();
      } else {
        await this.getOrgListData();
        await this.initDate();
      }
    },
    // 初始化日期
    initDate(){
      api.getLatelyReportMonth().then(res => {
        if ( !res.currentPeriod ) {
          return this.$Message.error('本期暂无数据！');
        }
        if ( res.previousPeriod ) {
          // 上期
          this.formInline.preDate = [
            moment(`${ res.previousPeriod }-01`).format('YYYY-MM-DD'),
            moment(
              `${ res.previousPeriod }-${ moment(res.previousPeriod, 'YYYY-MM').daysInMonth() }`
            ).format('YYYY-MM-DD')
          ];
        } else {
          this.formInline.preDate = [];
        }
        if ( res.currentPeriod ) {
          // 本期
          let startTime = moment(`${ res.currentPeriod }-01`).format('YYYY-MM-DD');
          let endTime = moment(
            `${ res.currentPeriod }-${ moment(res.currentPeriod, 'YYYY-MM').daysInMonth() }`
          ).format('YYYY-MM-DD');
          let _diffDays = moment(endTime).diff(moment(startTime), 'days');
          let preStartTime = moment(startTime)
            .subtract(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          let preEndTime = moment(endTime)
            .subtract(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          this.formInline.currentDate = [startTime, endTime];
          this.formInline.preDate = [preStartTime, preEndTime];

        } else {
          this.formInline.currentDate = [];
        }
        this.depNames = '';
        this.search();
      });
    },
    search(){
      this.params = this.getParamsData();
      localStorage.setItem('business_data', JSON.stringify({...this.params, departName: this.departmentName}));
      // 数据总览
      this.getReviewData();
      // 暗访门店分布
      this.getAgentDepDistributionData();
      // 暗访门店占比
      this.getAgentDepByOrgData();
      // 部门得分对比
      this.getOrgMarkCompareData(1);
      // 报告等级分布
      this.getDepRankDistributionData();
      // 检查项大类得分对比 默认平均得分率
      this.getTemplateOrParentTemplateMarkData(1);
      // 客户满意度
      this.getOrgClientSatisfyScoreData();
      // 得分率/满意度落点分布
      this.getOrgOrDepClientSatisfyScoreAndAverageScoreData(1);
      // 门店排名
      this.getDepRankData();
      // 小类排名
      this.getPublicOpinionAnalysisData();
    },
    reset(){
      localStorage.getItem('business_data') && localStorage.removeItem('business_data');
      this.metricsList = defaultMetrics;
      this.cartsList = JSON.parse(JSON.stringify(cartsList));
      this.metricsFlag = false;
      this.depNames = '';
      this.formInline = {
        currentDate: [],
        preDate: [],
        depIds: []
      };
      this.$refs.quickSearchRef.quickSearch = '';
      this.initData();
    },
    exportPdf(){
      const pdfLoader = new exportFile.PdfLoader(this.$refs.containerRef, {
        fileName: "企业概览",
      });
      pdfLoader.getPdf().then((res) => {
        console.log("[ 导出成功] >", res);
        this.$Message.success('导出成功！');
      });
    },
    getQuickSearchParams(payload){
      let {
        currentPeriodEndTime,
        currentPeriodStartTime,
        orgIdList,
        departName,
        previousPeriodEndTime,
        previousPeriodStartTime
      } = payload.content;
      this.formInline.currentDate = [currentPeriodStartTime, currentPeriodEndTime];
      this.formInline.preDate = [previousPeriodStartTime, previousPeriodEndTime];
      this.formInline.depIds = orgIdList;
      this.department = orgIdList.map((item, index) => {
        return {id: `O_${ item }`, name: departName[index]};
      });
      this.departmentName = departName;
      this.mixedDefaultData = {orgs: this.department};
      this.search();
    },
    getQuickSearchData(payload){
      this.quickSearchId = payload.id;
      this.quickSearchContent = JSON.parse(payload.content);
    },
    quickSaveHandle(){
      if ( !this.quickInput.trim() ) {
        return this.$Message.error('请输入筛选条件名称！');
      }
      if ( this.quickSearchContent.filter(item => item.name == this.quickInput).length > 0 ) return this.$Message.error('筛选条件名称已存在！');
      let _search = this.getParamsData();
      let params = {
        id: this.quickSearchId,
        content: JSON.stringify([
          ...this.quickSearchContent,
          {..._search, name: this.quickInput, departName: this.departmentName}]),
      };
      api.updateSearchCondition(params).then(res => {
        this.$Message.success('保存成功！');
        this.quickCancelHandle();
        this.$refs.quickSearchRef.quickSearch = '';
        this.$refs.quickSearchRef.getQuickSearch();
      });
    },
    quickCancelHandle(){
      this.poptipVisible = false;
      this.quickInput = '';
    },
    getAgentDepDistributionData(){
      let params = this.getParamsData();
      delete params.previousPeriodStartTime;
      delete params.previousPeriodEndTime;
      api
        .getAgentDepDistribution(params)
        .then(res => {
          if ( res ) {
            this.mapMarkersData = res;
            this.storeMapChart();
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getAgentDepByOrgData(){
      let params = this.getParamsData();
      delete params.previousPeriodStartTime;
      delete params.previousPeriodEndTime;
      api
        .getAgentDepByOrg(params)
        .then(res => {
          if ( Array.isArray(res) && res.length ) {
            let total = 0;
            res.forEach(item => {
              item.name = item.key;
              total += Number(item.value);
            });
            let _temp = JSON.parse(JSON.stringify(res));
            _temp.sort((a, b) => {
              return b.value - a.value;
            });
            let storeNameObj = _temp[0];
            let storeRate = ((storeNameObj.value / total) * 100).toFixed(2) + '%';
            this.storeText = `本期【${ storeNameObj.key }】暗访门店占比最高，共有 ${ storeNameObj.value } 家，占比${ storeRate }`;
            this.ratePieChart.data = res || [];
            this.ratePieChart.options.series[0].data = res || [];
          } else {
            this.storeText = '本期暂无数据！';
            this.ratePieChart.options.series[0].data = res || [];
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getOrgMarkCompareData(type = 1){
      let params = this.getParamsData();
      api
        .getOrgMarkCompare(params)
        .then(res => {
          if ( res.orgNameList && res.orgNameList.length > 0 ) {
            let _temp = this.depRateChart;
            _temp.orgNameList = res.orgNameList || [];
            _temp.currentAverageScore = res.currentAverageScore || '';
            _temp.currentAverageScoreScale = res.currentAverageScoreScale || '';
            _temp.currentScoreList = res.currentScoreList || [];
            _temp.previousScoreList = res.previousScoreList || [];
            _temp.currentScoreScaleList = res.currentScoreScaleList || [];
            _temp.previousScoreScaleList = res.previousScoreScaleList || [];
            _temp.defScoreList = res.defScoreList || [];
            _temp.defScoreScaleList = res.defScoreScaleList || [];
            this.depRateChart = _temp;
            this.depScoreRateChart(type);
          } else {
            this.depText = '本期暂无数据！';
            this.depRateChart.data = [];
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getDepRankDistributionData(){
      let params = this.getParamsData();
      delete params.previousPeriodStartTime;
      delete params.previousPeriodEndTime;
      api
        .getDepRankDistribution(params)
        .then(res => {
          if ( res.orgNameList && res.orgNameList.length ) {
            this.storeLevelPieChart.orgNameList = res.orgNameList;
            this.storeLevelPieChart.orgScoreShiftVoList = res.orgScoreShiftVoList || [];
            this.storeLevelPieChart.scoreShiftVoList = res.scoreShiftVoList || [];
            this.storeChart();
          } else {
            this.reportLevelText = '本期暂无数据！';
            // this.storeLevelPieChart.chartRef.clear();
            // this.storeLevelBarChart.chartRef.clear();
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getTemplateOrParentTemplateMarkData(type = 1){
      let param = this.getParamsData();
      let params = {
        ...param,
        loseMarkType: 2,//1-小类，2-大类
        filterNoMark: 1, // 非0 数据
      };
      this.params = params;
      api
        .getTemplateOrParentTemplateMark(params)
        .then(res => {
          if ( res.nameList && res.nameList.length ) {
            let _temp = this.checkItemChart;
            _temp.nameList = res.nameList || [];
            _temp.currentPeriod = res.currentPeriod || [];
            _temp.previousPeriod = res.previousPeriod || [];
            _temp.currentAverageScore = res.currentAverageScore || 0;
            _temp.currentAverageScoreScale = res.currentAverageScoreScale || 0;
            _temp.defScoreScaleList = res.defScoreScaleList || [];
            _temp.defScoreList = res.defScoreList || [];
            this.checkItemChart = _temp;
            this.checkItemBarChart(type);
          } else {
            this.checkItemText = '本期暂无数据！';
            // this.checkItemChart.chartRef.clear();
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getOrgClientSatisfyScoreData(){
      let params = this.getParamsData();
      api
        .getOrgClientSatisfyScore(params)
        .then(res => {
          if ( res.orgNameList && res.orgNameList.length ) {
            let _temp = this.customerBarChart;
            _temp.currentOrgScoreList = res.currentOrgScoreList || [];
            _temp.previousOrgScoreList = res.previousOrgScoreList || [];
            _temp.currentAverageScore = res.currentAverageScore || 0;
            _temp.defCurrentAverageScore = res.defCurrentAverageScore || 0;
            _temp.orgNameList = res.orgNameList || [];
            _temp.defScoreList = res.defScoreList || [];
            _temp.choiceNumList = res.choiceNumList || [];
            this.customerBarChart = _temp;
            this.customerChart();
          } else {
            this.customText = '本期暂无数据！';
          }
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getDepRankData(){
      let params = this.getParamsData();
      params.orderType = this.storeOrderType;
      params.pageSize = this.pageSize;
      params.pageNumber = this.storeNumber;
      api
        .getDepRank(params)
        .then(res => {
          this.storeTotal = res.total;
          this.storeData = res.records.map(item => {
            if ( item.previousDepScoreRate != null ) {
              item._diff = Number(item.currentDepScoreRate) - Number(item.previousDepScoreRate);
            } else {
              item._diff = null;
            }
            return item;
          });
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getOrgOrDepClientSatisfyScoreAndAverageScoreData(type = 1){
      let params = this.getParamsData();
      delete params.previousPeriodStartTime;
      delete params.previousPeriodEndTime;
      api.getOrgOrDepClientSatisfyScoreAndAverageScore(params).then(res => {
        if ( res.orgNameList && res.orgNameList.length ) {
          let _temp = this.cursorChart;
          _temp.averageScoreScale = res.averageScoreScale || 0;
          _temp.averageClientSatisfyScore = res.averageClientSatisfyScore || 0;
          _temp.orgScoreScaleList = res.orgScoreScaleList || [];
          _temp.orgClientSatisfyScoreList = res.orgClientSatisfyScoreList || [];
          _temp.orgNameList = res.orgNameList || [];
          _temp.depNameList = res.depNameList || [];
          _temp.depScoreScaleList = res.depScoreScaleList || [];
          _temp.depClientSatisfyScoreList = res.depClientSatisfyScoreList || [];
          _temp.averageScoreList = res.averageScoreList || [];
          _temp.averageScoreScaleList = res.averageScoreScaleList || [];
          this.cursorChart = _temp;
          this.cursorChartData(type);
        } else {
          // this..cursorChart.chartRef.clear();
        }

      }).catch(e => {
        this.$Message.error(e.result);
      });
    },
    getPublicOpinionAnalysisData(){
      let params = this.getParamsData();
      params.loseMarkType = 1; //1-小类，2-大类
      params.orderType = this.checkItemOrderType; //0-升序，1-降序
      params.pageSize = this.pageSize;
      params.pageNumber = this.checkItemNumber;
      this.params = params;
      api
        .getTemplateOrParentRank(params)
        .then(res => {
          this.checkItemTotal = res.total;
          this.checkItemData = res.records.map(item => {
            if ( item.previousScoreRate != null ) {
              item._diff = item.currentScoreRate - item.previousScoreRate;
            } else {
              item._diff = null;
            }
            return item;
          });
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    getReviewData(){
      let params = this.getParamsData();
      api
        .getEnterpriseDataOverview(params)
        .then(res => {
          this.defPassTaskScale = res.defPassTaskScale;
          this.defAverageScoreScale = res.defAverageScoreScale;
          Object.keys(res).forEach(key => {
            this.cartsList.forEach(item => {
              if ( key == item.key ) {
                item[key] = res[key] || 0;
              }
              if ( key == item.diffKey ) {
                item[key] = res[key];
              }
              if ( item[item.diffKey] >= 0 ) {
                item.upOrDown = true;
              } else {
                item.upOrDown = false;
              }
            });
          });
        })
        .catch(e => {
          this.$Message.error(e.result);
        });
    },
    // 指标切换
    metricsChange(data){
      if ( data.length < 5 ) return this.$Message.warning('至少显示5个指标');
      let _temp = JSON.parse(JSON.stringify(this.cartsList));
      _temp.forEach(item => {
        item.checked = false;
        data.forEach(val => {
          if ( item.name == val ) {
            item.checked = true;
          }
        });
      });
      this.cartsList = _temp;
      this.$forceUpdate();
    },
    // 时间选择
    timeInputClick(date, type){
      const [start, end] = date;
      let _diffDays = 0;
      let startTime = '',
        endTime = '',
        preStartTime = '',
        preEndTime = '';
      switch(type){
        case 1:
          startTime = moment(start).format('YYYY-MM-DD');
          endTime = moment(end).format('YYYY-MM-DD');
          _diffDays = moment(end).diff(moment(start), 'days');
          preStartTime = moment(start)
            .subtract(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          preEndTime = moment(end)
            .subtract(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          this.formInline.currentDate = [startTime, endTime];
          this.formInline.preDate = [preStartTime, preEndTime];
          break;
        case 2:
          preStartTime = moment(start).format('YYYY-MM-DD');
          preEndTime = moment(end).format('YYYY-MM-DD');
          _diffDays = moment(end).diff(moment(start), 'days');
          startTime = moment(start)
            .add(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          endTime = moment(end)
            .add(_diffDays + 1, 'days')
            .format('YYYY-MM-DD');
          this.formInline.currentDate = [startTime, endTime];
          this.formInline.preDate = [preStartTime, preEndTime];
          break;
        default:
          break;
      }
      this.currentIndex = -1;
      this.showTimer = false;
    },
    // 门店分布
    storeMapChart(){
      let _temp = {};
      this.mapMarkersData.forEach(item => {
        if ( !_temp[item.divisionColor] ) {
          _temp[item.divisionColor] = {
            name: item.divisionName,
            value: item.divisionColor
          };
        }
      });
      this.mapLabelList = [];
      Object.keys(_temp).forEach(item => {
        this.mapLabelList.push(_temp[item]);
      });
      const infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30),
      });
      let map = new AMap.Map('mapChart', {
        resizeEnable: true,
        center: [120.616562, 31.336895],
        zoom: 5
      });

      map.clearMap(); // 清除地图覆盖物
      let markers = [];
      this.mapMarkersData.forEach(item => {
        markers.push({
          icon: require(`@/assets/ico_${ item.divisionColor }.png`),
          position: [item.longitude, item.latitude],
          depName: item.depName,
          divisionName: item.divisionName,
        });
      });
      // 添加一些分布不均的点到地图上,地图上添加三个点标记，作为参照
      markers.forEach(item => {
        let marker = new AMap.Marker({
          map: map,
          icon: item.icon,
          position: [item.position[0], item.position[1]],
          offset: new AMap.Pixel(-13, -30)
        });
        marker.on('mouseover', function (e){
          infoWindow.setContent(
            `<div class="description">
              <h5 class="title">${ item.depName }</h5>
              <div class="mt-3 detail">
                等级：${ item.divisionName }<br />
              </div>
            </div>`
          );
          infoWindow.open(map, [item.position[0], item.position[1]]);
        });
        marker.on('mouseout', function (e){
          infoWindow.close(map, [item.position[0], item.position[1]]);
        });
      });
    },
    // 部门得分对比
    depScoreRateChart(type){
      const {
        optionsFn,
        options,
        orgNameList,
        currentAverageScore,
        currentAverageScoreScale,
        currentScoreList,
        previousScoreList,
        currentScoreScaleList,
        previousScoreScaleList,
        defScoreList,
        defScoreScaleList
      } = this.depRateChart;
      let option = optionsFn({...this, orgNameList});
      let _data = [], _dataRate = [], _averageData = [];
      orgNameList.forEach((item, index) => {
        _data.push({
          key: item,
          value: currentScoreScaleList[index] || 0,
          diffValue: defScoreScaleList[index] || 0,
        });
        _dataRate.push({
          key: item,
          value: defScoreScaleList[index] || 0,
        });
      });
      _data.sort((a, b) => {
        return b.value - a.value;
      });
      _dataRate.sort((a, b) => {
        return b.value - a.value;
      });
      this.depScoreMax = _data[0];
      this.depScoreMin = _data[_data.length - 1];
      this.depScoreChainMax = _dataRate[0];
      this.depScoreChainMin = _dataRate[_dataRate.length - 1];
      this.depText = `本期【${ this.depScoreMax.key }】的平均得分率最高，环比上期增长了 ${ this.depScoreMax.diffValue }%,【${ this.depScoreMin.key }】的平均得分率最低，环比上期下降了${ Math.abs(this.depScoreMin.diffValue) }%；环比上期，【${ this.depScoreChainMax.key }】的平均得分率增幅最大，增长了${ this.depScoreChainMax.value }%；【${ this.depScoreChainMin.key }】降幅最大，下降了${ Math.abs(this.depScoreChainMin.value) }%。`;
      option.xAxis.data = orgNameList;
      if ( type == 1 ) {
        option.series[0].data = currentScoreScaleList;
        option.series[0].name = '本期平均得分率';
        option.series[1].data = previousScoreScaleList;
        option.series[1].name = '上期平均得分率';
        option.yAxis[0].name = '平均得分率';
        option.yAxis[0].axisLabel = {formatter: '{value} %'};
        option.yAxis[1].axisLabel = {formatter: '{value} %'};
        option.series[2].data = defScoreScaleList;
        orgNameList.forEach(() => {
          _averageData.push(currentAverageScoreScale);
        });
        option.series[3].data = _averageData;
        option.series[3].name = '本期企业平均得分率';
      } else if ( type == 2 ) {
        option.series[0].data = currentScoreList;
        option.series[0].name = '本期平均得分';
        option.series[1].data = previousScoreList;
        option.series[1].name = '上期平均得分';
        option.yAxis[0].name = '平均得分';
        option.yAxis[0].axisLabel = {formatter: '{value}'};
        option.yAxis[1].axisLabel = {formatter: '{value}'};
        option.series[2].data = defScoreList;
        orgNameList.forEach(() => {
          _averageData.push(currentAverageScore);
        });
        option.series[3].data = _averageData;
        option.series[3].name = '本期企业平均得分';
      }
      this.depRateChart.options = option;
    },
    // 报告等级分布
    storeChart(){
      const {options, orgNameList, orgScoreShiftVoList, scoreShiftVoList} =
        this.storeLevelPieChart;
      let _pieData = [];
      _pieData = scoreShiftVoList.map((item, index) => {
        item.value = item.num;
        return item;
      });
      this.storeLevelPieChart.options.series[0].data = _pieData;
      let barOptionFn = this.storeLevelBarChart.barOptionFn;
      let barOptions = barOptionFn({...this, orgNameList});
      barOptions.xAxis.data = orgNameList;
      let _barData = [];
      // 报告总数
      let total = 0;
      let _totalArr = [];
      orgNameList.forEach((item, index) => {
        let _t = 0;
        orgScoreShiftVoList.forEach((item, i) => {
          _t += item.orgTaskNum[index];
        });
        _totalArr.push(_t);
      });
      _barData = orgScoreShiftVoList.map(item => {
        let _data = [];
        item.orgTaskNum.forEach((el, i) => {
          if ( _totalArr[i] == 0 ) {
            _data.push(0.00);
          } else {
            _data.push((el / _totalArr[i] * 100).toFixed(2));
          }
        });
        item.type = 'bar';
        item.barWidth = '12';
        item.stack = '总量';
        item.data = _data;
        return item;
      });
      scoreShiftVoList.forEach(item => {
        total += Number(item.num);
      });
      let _subNum = scoreShiftVoList[scoreShiftVoList.length - 1] && scoreShiftVoList[scoreShiftVoList.length - 1].num;
      let reportLevelTotal = _subNum;
      let reportLastLevelRate = '0.00%';
      if ( total != 0 ) {
        reportLastLevelRate = ((_subNum / total) * 100).toFixed(2) + '%';
      }
      this.reportLevelText = `本期整体不合格报告共有${ reportLevelTotal }份，不合格率为 ${ reportLastLevelRate }`;
      barOptions.series = _barData;
      this.storeLevelBarChart.options = barOptions;
    },
    // 检查项大类得分对比
    checkItemBarChart(type){
      let _rate1 = [], _rate2 = [];
      let _score1 = [], _score2 = [];
      const {
        optionsFn,
        nameList,
        currentPeriod,
        previousPeriod,
        defScoreList,
        defScoreScaleList,
        currentAverageScore,
        currentAverageScoreScale,
      } = this.checkItemChart;
      let option = optionsFn({...this, nameList});
      option.xAxis.data = nameList;
      let _data = [], _dataRate = [], _averageData = [];
      nameList.forEach((item, index) => {
        _data.push({ //得分率环比
          key: item,
          value: defScoreScaleList[index] || 0,
        });

        _dataRate.push({
          key: item,//得分率
          value: currentPeriod[index].scoreRate || 0,
          diffValue: defScoreScaleList[index] || 0,//得分率环比
        });
      });
      _data.sort((a, b) => {
        return b.value - a.value;
      });
      this.checkItemScoreMax = _data[0];
      this.checkItemScoreMin = _data[_data.length - 1];
      _dataRate.sort((a, b) => {
        return b.value - a.value;
      });
      this.checkItemChainMax = _dataRate[0];
      this.checkItemChainMin = _dataRate[_dataRate.length - 1];
      let text1 = '', text2 = '';
      if ( this.checkItemScoreMax.value > 0 ) {
        text1 = `【${ this.checkItemScoreMax.key }】大类的平均得分率增幅最大，增长了${ this.checkItemScoreMax.value }%`;
      } else if ( this.checkItemScoreMax.value < 0 ) {
        text1 = `【${ this.checkItemScoreMin.key }】大类的平均得分率降幅最大，下降了${ Math.abs(this.checkItemScoreMin.value) }%`;
      }
      if ( this.checkItemScoreMax.value > 0 && this.checkItemScoreMin.value < 0 ) {
        text2 = `【${ this.checkItemScoreMax.key }】大类的平均得分率增幅最大，增长了${ this.checkItemScoreMax.value }%；【${ this.checkItemScoreMin.key }】大类的平均得分率降幅最大，下降了${ Math.abs(this.checkItemScoreMin.value) }%`;
      }

      this.checkItemText = `本期【${ this.checkItemChainMax.key }】大类的平均得分率最高，环比上期${ this.checkItemChainMax.diffValue > 0 ? '增长' : '下降' }了${ Math.abs(this.checkItemChainMax.diffValue) }%,
      ${ this.checkItemChainMin.key }】大类的平均得分率最低，环比上期${ this.checkItemChainMin.diffValue > 0 ? "增长" : "下降" }了${ Math.abs(this.checkItemChainMin.diffValue) }%；
      环比上期，${ text1 }; ${ text2 }`;

      if ( type == 1 ) {
        // 平均得分率
        // 本期
        currentPeriod.forEach(item => {
          _rate1.push(item.scoreRate);
        });
        // 上期
        previousPeriod.forEach(item => {
          _rate2.push(item.scoreRate);
        });
        option.series[0].data = _rate1;
        option.series[0].name = '本期平均得分率';
        option.series[1].data = _rate2;
        option.series[1].name = '上期平均得分率';
        option.yAxis[0].name = '平均得分率';
        option.yAxis[0].axisLabel = {formatter: '{value} %'};
        option.yAxis[1].axisLabel = {formatter: '{value} %'};
        option.series[2].data = defScoreScaleList;
        nameList.forEach((item, index) => {
          _averageData.push(currentAverageScoreScale);
        });
        option.series[3].data = _averageData;
        option.series[3].name = '本期企业平均得分率';
      } else if ( type == 2 ) {
        // 平均得分
        currentPeriod.forEach(item => {
          _score1.push(item.mark);
        });
        // 上期
        previousPeriod.forEach(item => {
          _score2.push(item.mark);
        });
        option.series[0].data = _score1;
        option.series[0].name = '本期平均得分';
        option.series[1].data = _score2;
        option.series[1].name = '上期平均得分';
        option.yAxis[0].name = '平均得分';
        option.yAxis[0].axisLabel = {formatter: '{value}'};
        option.yAxis[1].axisLabel = {formatter: '{value}'};
        option.series[2].data = defScoreList;
        nameList.forEach((item, index) => {
          _averageData.push(currentAverageScore);
        });
        option.series[3].data = _averageData;
        option.series[3].name = '本期企业平均得分';
      }
      this.checkItemChart.options = option;
    },
    // 客户满意度
    customerChart(){
      const {
        optionsFn,
        currentOrgScoreList,
        previousOrgScoreList,
        defScoreList,
        currentAverageScore,
        defCurrentAverageScore,
        orgNameList,
        choiceNumList
      } = this.customerBarChart;
      let barOptions = optionsFn({...this, orgNameList});
      barOptions.xAxis.data = orgNameList;
      barOptions.series[0].data = currentOrgScoreList;
      barOptions.series[1].data = previousOrgScoreList;
      barOptions.series[2].data = defScoreList;

      let _temp = [], _tempRate = [];
      orgNameList.forEach((item, index) => {
        _temp.push({
          key: item,
          value: currentOrgScoreList[index],
        });
        _tempRate.push({
          key: item,
          value: defScoreList[index],
        });
      });
      _temp.sort((a, b) => {
        return b.value - a.value;
      });
      _tempRate.sort((a, b) => {
        return b.value - a.value;
      });
      let _tempRateMin = _tempRate[_tempRate.length - 1];
      let _max = _temp[0];
      let _min = _temp[_temp.length - 1];

      this.customText = `本期${ _max.key }的客户满意度评分最高，${ _min.key }最低`;
      this.customerBarChart.options= barOptions;
    },
    cursorChartData(type){
      const {
        lineOptions,
        orgScoreScaleList,
        orgClientSatisfyScoreList,
        orgNameList,
        depNameList,
        depScoreScaleList,
        depClientSatisfyScoreList,
        averageScoreScale,
        averageClientSatisfyScore,
      } = this.cursorChart;
      let _depScoreList = [], _depRateList = [], _orgScoreList = [], _orgRateList = [], _averageScoreScale = [],
        _averageClientSatisfyScore = [];
      lineOptions.series[0].markLine.data[0].xAxis = averageClientSatisfyScore;
      lineOptions.series[0].markLine.data[1].yAxis = averageScoreScale;
      // 点图
      if ( this.scatterRadio == 1 ) { // 部门
        orgNameList.forEach((item, index) => {
          _depScoreList.push({
            name: item,
            value: [orgClientSatisfyScoreList[index], orgScoreScaleList[index]]
          });
        });
        lineOptions.series[0].data = _depScoreList;
      } else {
        // 门店
        depNameList.forEach((item, index) => {
          _orgScoreList.push({
            name: item,
            value: [depClientSatisfyScoreList[index], depScoreScaleList[index]]
          });
        });
        lineOptions.series[0].data = _orgScoreList;
      }
      console.log('lineOptions',lineOptions);
      this.cursorChart.options = lineOptions;
    },
    cursorChartBarData(type){
      const {
        barOptions,
        orgScoreScaleList,
        orgClientSatisfyScoreList,
        orgNameList,
        depNameList,
        depScoreScaleList,
        depClientSatisfyScoreList,
        averageScoreScale,
        averageClientSatisfyScore,
      } = this.cursorChart;
      let _depScoreList = [], _depRateList = [], _orgScoreList = [], _orgRateList = [];
      if ( this.scatterRadio == 1 ) { // 部门
        barOptions.xAxis.data = orgNameList;
        barOptions.series[0].data = orgScoreScaleList;
        barOptions.series[1].data = orgClientSatisfyScoreList;
      } else { // 门店
        barOptions.xAxis.data = depNameList;
        barOptions.series[0].data = depScoreScaleList;
        barOptions.series[1].data = depClientSatisfyScoreList;
      }
      this.cursorChart.options= barOptions;
    },
    /**
     *
     * @param {*} type  图表类比
     * @param {*} index 图表展示类比
     */
    radioChange(type, index){
      switch(type){
        case 1:
          this.depRadio = index;
          this.depScoreRateChart(index);
          break;
        case 2:
          this.checkItemRadio = index;
          this.checkItemBarChart(index);
          break;
        case 3:
          this.scatterRadio = index;
          if ( this.currentChart == 1 ) {
            // 散点图
            this.cursorChartData(this.scatterRadio);
          } else {
            // 柱状图
            this.cursorChartBarData(this.currentChart);
          }
          break;

        default:
          break;
      }
    },
    changeChartType(type){
      this.currentChart = type;
      if ( type == 1 ) {
        this.cursorChartData(this.scatterRadio);
      } else {
        this.cursorChartBarData(this.scatterRadio);
      }
    },
    storeSortChange({order}){
      order == 'desc' ? this.storeOrderType = 1 : this.storeOrderType = 0;
      this.storeNumber = 1;
      this.getDepRankData();
    },
    storePageChange(val){
      this.storeNumber = val;
      this.getDepRankData();
    },
    itemSortChange({order}){
      order == 'desc' ? this.checkItemOrderType = 1 : this.checkItemOrderType = 0;
      this.checkItemNumber = 1;
      this.getPublicOpinionAnalysisData();
    },
    itemPageChange(val){
      this.checkItemNumber = val;
      this.getPublicOpinionAnalysisData();
    },
    getParamsData(){
      let {currentDate, preDate, depIds} = this.formInline;
      if ( depIds.length == 0 ) {
        this.defaultDepList.forEach(item => {
          depIds.push(item.id.split('_')[1]);
        });
      }
      let params = {
        currentPeriodStartTime: currentDate[0] ? moment(currentDate[0]).format('YYYY-MM-DD') : '',
        currentPeriodEndTime: currentDate[1] ? moment(currentDate[1]).format('YYYY-MM-DD') : '',
        previousPeriodStartTime: preDate[0] ? moment(preDate[0]).format('YYYY-MM-DD') : '',
        previousPeriodEndTime: preDate[1] ? moment(preDate[1]).format('YYYY-MM-DD') : '',
        orgIdList: depIds
      };
      return params;
    },
    /**
     * 部门
     */
    getDepCheckedData(data){
      let orgs =
        data.orgs &&
        data.orgs.map(i => {
          return {
            name: i.name,
            id: i.id
          };
        });
      this.mixedDefaultData = data;
      this.department = [...orgs];
      this.formInline.depIds = this.department.map(i => i.id.split('_')[1]);
      this.departmentName = this.department.map(i => i.name);
    },
    // 获取默认顶层部门
    async getOrgListData(){
      let params = {
        groupId: this.enterpriseId,
        keyword: '',
        showType: 4,
        showShopCount: true
      };
      try {
        let res = await api.getOrganizesTrees(params);
        this.defaultDepList = res;
        this.mixedDefaultData = {orgs: this.defaultDepList};
        this.departmentName = this.defaultDepList.map(item => item.name);
      } catch(error){
        // console.log('error', error);
      }
    },
    downloadHandle(type){
      let params = this.getParamsData();
      switch(type){
        case 'mapChart':
          api.exportAgentDepDistributionExcel(params).then(res => {
            downloadFile('暗访门店分布.xlsx', res.data);
          });
          break;
        case 'store':
          this.params.orderType = this.storeOrderType;
          this.params.pageSize = this.pageSize;
          this.params.pageNumber = this.storeNumber;
          api.exportDepRankExcel(this.params).then(res => {
            downloadFile('门店排名.xlsx', res.data);
          });
          break;
        case 'subItem':
          this.params.loseMarkType = 1; //1-小类，2-大类
          this.params.orderType = this.checkItemOrderType; //0-升序，1-降序
          this.params.pageSize = this.pageSize;
          this.params.pageNumber = this.checkItemNumber;
          api.exportTemplateRankExcel(this.params).then(res => {
            downloadFile('检查小类排名.xlsx', res.data);
          });
          break;
        default:
          break;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  box-sizing: border-box;
  padding: 0 12px 0 0;

  .header {
    background: #fff;
    border-radius: 0 0 6px 6px;

    .title {
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      padding: 10px 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      font-size: 18px;
      line-height: 29px;
      color: #333333;
    }

    .search {
      box-sizing: border-box;
      padding: 10px 16px;

      ::v-deep .ivu-form {
        .ivu-form-item {
          margin-bottom: 18px;
        }

        .ivu-form-item-label {
          text-align: left;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
        }
      }

      .form-item-btn {
        margin: 0 10px;
      }
    }
  }

  .container {
    margin-top: 12px;

    .box {
      box-sizing: border-box;
      padding: 16px;
      background: #ffffff;
      border-radius: 6px;
      margin-bottom: 12px;

      .box-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        .title {
          width: 80%;
          font-family: PingFangSC-SNaNpxibold;
          font-weight: 600;
          font-size: 14px;
          color: #333333;
          line-height: 32px;
        }

        .btn, .btn-box {
          display: flex;
          position: relative;

          .btn-list {
            display: none;
          }

          &:hover .btn-list {
            display: block;
          }

          .chart-radio {
            background: #f0f0f0;
            border-radius: 6px;
            box-sizing: border-box;
            padding: 2px;
            display: flex;
            align-items: center;
            margin-right: 12px;
          }

          .chart-icon {
            padding: 0 10px;

            .chart-img {
              width: 25px;
              height: 25px;
              border-radius: 5px;
              padding: 5px;
              cursor: pointer;
            }

            .current-chart {
              background: #fff;
            }
          }

          .chart-btn {
            height: 28px;
            box-sizing: border-box;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            font-family: PingFangSC-Medium;
            font-size: 12px;
            color: #7f7f7f;
            letter-spacing: 0;
            text-align: center;
            cursor: pointer;

            &.active-radio {
              font-weight: 500;
              color: #000000;
              background: #ffffff;
            }
          }

          .default-icon {
            width: 16px;
            height: 16px;
            margin-left: 10px;
            cursor: pointer;
          }
        }

        .btn-option {
          position: relative;

          .metrics-list {
            position: absolute;
            top: 35px;
            left: -50px;
            box-sizing: border-box;
            padding: 8px 16px;
            min-width: 200px;
            height: 220px;
            z-index: 100;

            &::-webkit-scrollbar {
              display: none;
              /* Chrome Safari */
            }

            scrollbar-width: none;
            /* firefox */
            -ms-overflow-style: none;
            /* IE 10+ */
            overflow-x: hidden;
            overflow-y: auto;
            background: #fff;
            box-shadow: 0 0 6px 0 #0000001a;
            border-radius: 6px;

            .ivu-checkbox-group {
              display: block;
            }

            .item {
              font-family: PingFangSC-Regular;
              font-weight: 400;
              font-size: 13px;
              color: #333333;
              line-height: 32px;
            }
          }
        }
      }

      .box-desc {
        background: #fffdf5;
        box-sizing: border-box;
        padding: 9px 16px;
        margin-bottom: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0;
        line-height: 22px;
      }

      .box-cards {
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding-left: 22px;

        .card {
          flex: 0 0 18.4%;
          margin: 0 22px 12px 0;
          box-sizing: border-box;
          padding: 16px;
          background: #f5f7fa;
          border-radius: 8px;


          &:last-child {
            margin-right: 0;
          }

          .card-title {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 14px;
            color: #333333;

            span {
              margin-right: 8px;
            }
          }

          .card-num {
            font-family: PingFangSC-Medium;
            font-weight: 500;
            font-size: 28px;
            color: #000000;
            letter-spacing: 0;
            line-height: 36px;
            margin: 7px 0 9px 0;

            .card-num-percent {
              font-size: 12px;
            }
          }

          .card-rate {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 12px;
            color: #7f7f7f;
            line-height: 16px;

            .rate {
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: #ff1111;
            }

            .rate-down {
              color: #00c7a6;
            }

            span {
              margin-right: 4px;
            }
          }
        }

        .cart-item {
          display: none;
        }
      }

      .charts {
        .charts-label {
          height: 30px;
          display: flex;
          align-items: center;
          margin: 6px 0;
          /* line-height: 20px; */

          p {
            display: flex;
            align-items: center;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 12px;
            color: #7f7f7f;
            margin-right: 8px;
          }

          span {
            width: 8px;
            height: 8px;
            background: #53a5ff;
            border-radius: 2px;
            margin-right: 6px;
          }
        }
      }
    }

    .box-sub {
      margin-top: 12px;
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      .box {
        width: 50%;
        margin-right: 12px;
        margin-bottom: 0;

        &:last-child {
          margin-right: 0;
        }

        .box-desc {
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .table-box {
      }
    }

    .charts-box {
      display: flex;

      .chart {
        margin-right: 12px;
        margin-bottom: 0;

        &:last-child {
          margin-right: 0;
        }
      }

      .pie-chart {
        width: 30%;
      }

      .bar-chart {
        flex: 1;
      }
    }

  }

  .search-btn {
    display: flex;
    align-items: center;

    .quick-save {
      background: rgba(255, 153, 0, .0588235294);
      border-radius: 24px 0 6px 0;
      margin-left: 20px;
      font-weight: 400;
      font-size: 13px;
      color: #f90;
      cursor: pointer;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 1px 5px;

      .ivu-icon {
        margin-right: 6px;
      }
    }

  }


}
</style>
<style lang="less">
.quick-input {
  p {
    margin: 8px 0;
  }

  .btn {
    text-align: right;

    .ivu-btn {
      margin-right: 10px;
    }
  }
}

.ivu-tooltip-inner {
  white-space: normal;
  max-width: max-content;
}

@media screen and (max-width: 1680px) {
  .card {
    flex: 0 0 17.5% !important;
  }
}

@media screen and (max-width: 1280px) {
  .card {
    flex: 0 0 17% !important;
  }
}

@media screen and (max-width: 1024px) {
  .card {
    flex: 0 0 16% !important;
  }
}

@media screen and (max-width: 950px) {
  .card {
    flex: 0 0 14% !important;
  }
}
</style>
)
