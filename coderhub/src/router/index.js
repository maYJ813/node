const fs = require('fs')

const useRoutes = function (){
  fs.readdirSync(__dirname).forEach(file => {
    if ( !file.endsWith('router.js') ) return
    const router = require(`./${ file }`)
    this.use(router.routes())
    this.use(router.allowedMethods())
  })
}

module.exports = useRoutes;
