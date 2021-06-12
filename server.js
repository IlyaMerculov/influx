const express = require('express');
const cors = require('cors')
const mqtt = require('mqtt')
const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')
const app = express();
const port = 3000;

let i = 0,
    j = 9,
    data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(InfluxDB)

const token = 'Llw-LNtJWuXwpUj8FqIujZv1hea0eb1vWT0Mic1f9LoBBplCZR-CMfj_eqHF5pN47dguiHoNXX_rzRDhC6OMsw=='
const org = 'ilyamerculov@gmail.com'
const bucket = 'numberData'

const clientInflux = new InfluxDB({url: 'https://europe-west1-1.gcp.cloud2.influxdata.com', token: token})

let clientMqtt = mqtt.connect('wss://test.mosquitto.org:8081' , 8080)
clientMqtt.on('connect', function () {
        clientMqtt.subscribe('data', function (err) {  
            
            let id1 = setInterval(() =>{
                if (data[i] <= data.length) {

                    console.log( typeof data[i] )
                    if (typeof data[i] !== 'undefined') {

                        const writeApi = clientInflux.getWriteApi(org, bucket)
                        writeApi.useDefaultTags({host: 'dataHost1'})
                        const point = new Point(`point${data[i]}`).floatField('used_percent', data[i])
                            writeApi.writePoint(point)
                            writeApi.close().then(() => {
                                    console.log('FINISHED')
                                }).catch(e => {
                                    console.error(e)
                                    console.log('Finished ERROR')
                                })

                        clientMqtt.publish('data', `${data[i++]}`)                        
                        }
                } else {
                    if (typeof data[j] !== 'undefined') {
                    const writeApi = clientInflux.getWriteApi(org, bucket)
                        writeApi.useDefaultTags({host: 'dataHost1'})
                        const point = new Point(`point_reverse${data[j]}`).floatField('used_percent', data[j])
                            writeApi.writePoint(point)
                            writeApi.close().then(() => {
                                    console.log('FINISHED')
                                }).catch(e => {
                                    console.error(e)
                                    console.log('Finished ERROR')
                                })

                        clientMqtt.publish('data', `${data[j--]}`) 
                    }
                    // console.log(typeof data[j])
                }
            }, 4000)
    
        })
    })
    clientMqtt.on('message', function (topic, message) {
        // message is Buffer
        if (message.toString() !== 'undefined') console.log( message.toString(), topic)
        if( message.toString() === 'undefined' ) clientMqtt.end()
      })

app.use( cors() )

app.get('/' , (req , res) => {
    // res.header("Content-Type" , "application/json")
    res.set("Content-Type" , "application/json")
    res.set("Access-Control-Allow-Methods" , "GET , PUT , POST , DELETE")
    res.set("Access-Control-Allow-Origin" , "*")
    res.send(JSON.stringify({"msg" : "Hello"}))
    
})

app.use(express.urlencoded({ extended : true }))
app.use(express.json());

app.listen(port , () => {
    console.log( ` Listen at  http://localhost:${port} ` )
})