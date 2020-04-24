async function getTimestamp(json, aggregate) {
  try {
    let i = json[0].timestamp;
    let mainObj = [];
    let obj = [];

    json.forEach((element) => {
      if (element.timestamp <= i + aggregate) {
        obj.push(element);
      } else {
        mainObj.push(obj);
        obj = [];
        obj.push(element);
        i = element.timestamp;
      }
    });
    return mainObj;
  } catch (error) {
    console.error('error: ', error);
  }
}

async function createObjInTab(array, urlTab, statusCodeTab, requestTab) {
  try {
    let mainObj = [];

    urlTab.forEach((url) => {
      requestTab.forEach((requestType) => {
        statusCodeTab.forEach((statusCode) => {
          var obj = {
            request_type: 'GET',
            status_code: 0,
            sum: 0,
            url: '',
            min_response_time: undefined,
            max_response_time: undefined,
            average_response_time: 0.0,
          };

          array.forEach((element) => {
            if (
              element.url === url &&
              element.request_type === requestType &&
              element.status_code === statusCode
            ) {
              obj = {
                request_type: element.request_type,
                status_code: element.status_code,
                sum: obj.sum + 1,
                url: element.url,
                min_response_time:
                  element['response_time​'] < obj['min_response_time'] ||
                  obj['min_response_time'] === undefined
                    ? element['response_time​']
                    : obj['min_response_time'],
                max_response_time:
                  element['response_time​'] > obj['max_response_time'] ||
                  obj['max_response_time'] === undefined
                    ? element['response_time​']
                    : obj['max_response_time'],
                average_response_time:
                  element['response_time​'] + obj.average_response_time,
              };
            }
          });
          if (obj.sum > 0) {
            obj.average_response_time = (
              obj.average_response_time / obj.sum
            ).toFixed(3);
            mainObj.push(obj);
          }
        });
      });
    });
    return mainObj;
  } catch (error) {
    console.error('error: ', error);
  }
}

async function createObjFromTimestamp(array) {
  try {
    let urlTab = [];
    let statusCodeTab = [];
    let requestTab = [];
    array.forEach((element) => {
      if (!urlTab.includes(element.url)) {
        urlTab.push(element.url);
      }
      if (!statusCodeTab.includes(element.status_code)) {
        statusCodeTab.push(element.status_code);
      }
      if (!requestTab.includes(element.request_type)) {
        requestTab.push(element.request_type);
      }
    });
    const ret = await createObjInTab(array, urlTab, statusCodeTab, requestTab); // PROMISE - Promise { <pending> }
    return ret;
  } catch (error) {
    console.error('error: ', error);
  }
}

async function getFirstObjFromTab(tab) {
  try {
    var obj = {};
    let len = tab.length;
    await tab.forEach(async (element, index) => {
      const ret = await createObjFromTimestamp(element);
      obj[element[0].timestamp] = ret;
      if (index + 1 === len) {
        let str = JSON.stringify(obj);
        const json = JSON.parse(str);
        console.log(json);
      }
    });
  } catch (error) {
    console.error('error: ', error);
  }
}

exports.parseTime = async function parseTime(json, aggregate) {
  try {
    const slotTime = parseInt(aggregate) * 60;
    const parsedAggregate = await getTimestamp(json, slotTime);

    await getFirstObjFromTab(parsedAggregate);
  } catch (error) {
    console.error('error: ', error);
  }
};
