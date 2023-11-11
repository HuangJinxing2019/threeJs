import Mock from "mockjs";
const {mock, Random} = Mock;
export default [
    {
        url: '/api/getDataList',
        method: 'get',
        response: () => {
            return {
                code: 0,
                data: [
                    {id: 1, name: '接入IOT设备', value: Random.integer(0, 100), unit: '台'},
                    {id: 2, name: '未处理治安事件', value: Random.integer(0, 50), unit: '起'},
                    {id: 3, name: '城市电力能耗', value: Random.integer(10, 1000), unit: '兆瓦时'},
                    {id: 4, name: '当前温度', value: Random.integer(23, 26), unit: '℃'},
                ]
            }
        }
    },
    {
        url: '/api/getEventList',
        method: 'get',
        response: () => {
            return {
                code: 0,
                data: mock({
                    'list|1-6': [
                        {
                            'id|+1': 1,
                            'info|1': [
                                {name: '治安', icon: 'jingcha.png', remark: '出现打架斗殴'},
                                {name: '火警', icon: 'fire.png', remark: '出现火灾'},
                                {name: '电力', icon: 'lightning.png', remark: '电力出现故障'}
                            ],
                            option: {
                              'x|1': [
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                              ],
                              'z|1':[
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                                  Random.float(-10, 10),
                              ],
                            },
                            uTime: Random.time(),
                        },
                    ],
                })
            }
        }
    }
]