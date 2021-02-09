maxResponseTime = 300;

// Number of requests you want to make.
iterations = 35;

// 100 ms is a delay between requests
delay = 100;

responseTimes = [];
i=0;

function sendRequest() {
    // Modify `url` and necessary `headers`
    pm.sendRequest({
        url: '',
        method: 'GET',
        header: {
            'Accept': 'application/json',
            'Authorization': '',
        },
    }, function (err, res) {
        pm.test(`Response time is ${res.responseTime} ms`, function (){
        pm.expect(err).to.equal(null);
        pm.expect(res).to.have.property('code', 200);
        responseTimes.push(res.responseTime);
        });

        if (i < iterations - 1) {
            i++;
            setTimeout(sendRequest, delay);
        } else {
            avgResponseTime = quantile(responseTimes, 90);
            pm.test(`Average response time is ${avgResponseTime} ms is lower than max response time: ${maxResponseTime} ms, the number of iterations is ${iterations}`, function () {
                pm.expect(avgResponseTime).to.be.below(maxResponseTime);
            });
        }
    });
}

sendRequest();

function sortNumber(a,b) {
    return a - b;
}

function quantile(array, percentile) {
    array.sort(sortNumber);
    index = percentile/100. * (array.length-1);
    if (Math.floor(index) === index) {
     result = array[index];
    } else {
        j = Math.floor(index)
        fraction = index - j;
        result = array[j] + (array[j+1] - array[j]) * fraction;
    }
    return result;
}
