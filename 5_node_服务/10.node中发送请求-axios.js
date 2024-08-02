
const axios = require('axios')

 axios.get('http://localhost:3000').then(response => {
   console.log('response',response)
 })

axios.post('http://localhost:3000', { name: 'tom', age:12}).then(response => {
  console.log('response-post',response)
})
