const baseUrl = 'https://api.vika.cn/fusion/v1/datasheets';
const fieldKey = 'name';
const DEFAULT_ICON_URL = '/default.ico';

export async function fetchData() {
  try {
    // 核心修正：用你自己的3个键名，正确从localStorage读取配置
    const apiKey = window.localStorage.getItem('uskmJmYPLRtEKHNZv5zAEES');
    const datasheetId = window.localStorage.getItem('dst8T3riTa0ssxLbdw');
    const viewId = window.localStorage.getItem('viwb03pe6Qzpo');
    
    // 检查配置是否完整
    if (!apiKey || !datasheetId || !viewId) {
      throw new Error('API配置不完整，请前往设置页面配置');
    }
    
    // 动态构建API URL
    const apiUrl = `${baseUrl}/${datasheetId}/records?viewId=${viewId}&fieldKey=${fieldKey}&pageSize=1000`;
    
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json' // 保持请求规范，提升兼容性
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // 处理非JSON格式错误响应
      console.error('API请求失败:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`API请求失败：${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('API返回数据:', responseData);
    
    // 严格校验返回数据格式
    if (!responseData || !responseData.data || !responseData.data.records || !Array.isArray(responseData.data.records)) {
      throw new Error(`返回数据格式不正确: ${JSON.stringify(responseData)}`);
    }
    
    // 打印第一条记录的完整信息，方便你查看字段结构
    if (responseData.data.records.length > 0) {
      console.log('完整记录信息:', responseData.data.records[0]);
    }
    
    // 数据映射、过滤与排序
    return responseData.data.records.map(record => {
      if (!record.fields || !record.fields.category || !record.fields.name) {
        console.warn('缺少必填字段的记录:', record);
        return null;
      }
      return {
        id: record.recordId,
        category: record.fields.category,
        name: record.fields.name,
        url: record.fields.url || '',
        description: record.fields.description || '',
        icon: record.fields.icon || DEFAULT_ICON_URL,
        sortOrder: record.fields.order ? parseInt(record.fields.order, 10) : 0, // 指定十进制，避免解析异常
        updatedAt: record.updatedAt || record.fields.updatedAt || null
      };
    }).filter(Boolean).sort((a, b) => b.sortOrder - a.sortOrder); // 降序排序，逻辑保持不变

  } catch (error) {
    console.error('数据获取失败:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    // 抛出错误，让调用方可以捕获并处理（如提示用户）
    throw error;
  }
}
