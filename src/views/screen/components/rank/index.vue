<template>
  <div class="rank-box">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 排行榜：表头 + 榜单 -->
    <div class="rank-list">
      <div class="rank-header">
        <span class="col-rank">排名</span>
        <span class="col-name">景区</span>
        <span class="col-count">预约数量</span>
      </div>
      <div class="rank-item" v-for="(item, index) in rankList" :key="item.name">
        <!-- 名次：NO.1 ~ NO.5，颜色随名次变浅 -->
        <span class="col-rank no" :style="{ color: noColors[index] }">
          NO.{{ index + 1 }}
        </span>
        <span class="col-name">{{ item.name }}</span>
        <!-- 预约占比：进度条长度 = 百分比 -->
        <div class="col-bar">
          <div class="bar-inner" :style="{ width: item.rate + '%' }">
            <span class="bar-text">{{ item.rate }}%</span>
          </div>
        </div>
        <span class="col-num">{{ item.count }}w</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 榜单数据（真实项目里由接口下发）
const rankList = [
  { name: '峨眉山', rate: 80, count: '8.00' },
  { name: '布达拉宫', rate: 60, count: '6.00' },
  { name: '九寨沟', rate: 50, count: '5.00' },
  { name: '万里长城', rate: 40, count: '4.00' },
  { name: '北京故宫', rate: 30, count: '3.00' },
]

// 名次对应的文字颜色
const noColors = ['#ff4b5c', '#ff8c42', '#ffd75e', '#4fd1c5', '#4a9eff']
</script>

<style scoped lang="scss">
.rank-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    margin-left: 10px;
    margin-top: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .rank-list {
    padding: 6px 14px 0;

    // 表头
    .rank-header {
      display: grid;
      grid-template-columns: 58px 84px 1fr 70px;
      align-items: center;
      height: 26px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;

      .col-count {
        text-align: center;
      }
    }

    // 每一行榜单：用素材图片做行背景
    .rank-item {
      display: grid;
      grid-template-columns: 58px 84px 1fr 70px;
      align-items: center;
      height: 36px;
      margin-bottom: 10px;
      padding: 0 4px;
      background: url(../../images/rankingChart-bg.png) no-repeat;
      background-size: 100% 100%;
      font-size: 14px;

      .no {
        font-style: italic;
        font-weight: 700;
      }

      .col-name {
        color: #fff;
        white-space: nowrap;
      }

      // 进度条：底色 + 彩色填充
      .col-bar {
        height: 12px;
        margin-right: 6px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 6px;

        .bar-inner {
          height: 100%;
          background: linear-gradient(90deg, #1e6fff, #35d0ff);
          border-radius: 6px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          transition: width 0.6s;

          .bar-text {
            padding-right: 4px;
            color: #fff;
            font-size: 12px;
            white-space: nowrap;
          }
        }
      }

      .col-num {
        color: #35d0ff;
        text-align: right;
        white-space: nowrap;
      }
    }
  }
}
</style>
