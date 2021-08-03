const axios = require('axios');
const URI = 'http://127.0.0.1:3000/';
describe('records test', () => {
    it('should return records', async () => {
        const req = {
            "startDate": "2016-01-26", 
            "endDate": "2016-02-02",
            "minCount": 99,
            "maxCount": 100
        }
        const res = await axios.post(URI, req);
        expect(res.data).toEqual({
            "msg": "Success",
            "code": 0,
            "records": [
                {
                    "_id": "5ee215d5e07f053f990cf210",
                    "totalCount": 100,
                    "key": "5ee215d5e07f053f990cf210",
                    "createdAt": "2016-01-26T15:27:39.027Z"
                }
            ]
        })
    })
    it('should return validation error', async () => {
        const req = {
            "startDate": "2016-01-26", 
            "endDate": "2016-02-02",
            "minCount": 101,
            "maxCount": 100
        }
        let res = null;
        try {
             res = await axios.post(URI, req);
        }
        catch(e) {
            expect(e.response.data).toEqual({
                "msg": "minCount is after maxCount",
                "code": 400,
                "records": []
            })
        }
        
    })
})