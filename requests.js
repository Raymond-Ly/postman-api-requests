// Max response time you are not expecting your endpoint to hit.
maxResponseTime = 200;

// Number of requests you want to make.
iterations = 20;

// 10 ms is a delay between requests
delay = 0.1;

responseTimes = [];
i=0;

function sendRequest() {
    pm.sendRequest({
        url: pm.variables.get("API_TEST_ENDPOINT"),
        method: 'GET',
        header: {
            'Accept': 'application/json',
            'Authorization': pm.variables.get("API_AUTH_KEY")
        },
    }, (err, res) => {
        pm.test(`Response time is ${res.responseTime} ms`, () => {
            pm.expect(err).to.equal(null);
            pm.expect(res).to.have.property('code', 200);
            responseTimes.push(res.responseTime);
        });

        if (i < iterations - 1) {
            i++;
            setTimeout(sendRequest, delay);
        } else {
            avgResponseTime = average(responseTimes);
            pm.test(
                `Average response time is ${avgResponseTime} ms is lower than max response time: ${maxResponseTime} ms, the number of iterations was ${iterations} for ${pm.variables.get("API_TEST_ENDPOINT")}`
                , () => {
                pm.expect(avgResponseTime).to.be.below(maxResponseTime);
            });

            today = new Date();
            dd = String(today.getDate()).padStart(2, '0');
            mm = String(today.getMonth() + 1).padStart(2, '0');
            yyyy = today.getFullYear();
            today = `${mm}/${dd}/${yyyy}`;

            pm.test(`Date: ${today}`);
        }
    });
}

sendRequest();

function average(array) {
    sum = 0;
    for( var i = 0; i < array.length; i++ ) {
        sum += parseInt(array[i], 10);
    }

    return sum/array.length;
}
