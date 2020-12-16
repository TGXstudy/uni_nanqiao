// AMap.js
// 高德map   https://webapi.amap.com/maps?v=1.4.11&key=你的高德地图的key
export default function MapLoader () {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap)
        } else {
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.async = true
			script.src ='https://webapi.amap.com/maps?v=1.4.10&callback=initAMap&key=38323ea012725d1542e5e98da64ac31c'
            script.onerror = reject
            document.head.appendChild(script);
			window.initAMap = () => {
			    resolve(window.AMap)
			}
        }
        
    })
}
  