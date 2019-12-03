/**
 * 坐标转换
 *
 * @param x
 * @param y
 * @param z
 * @constructor
 */
function CoordinateUtil(x,y,z) {
    this.x=x;
    this.y=y;
    this.z=z;

    this.x_pi=3.14159265358979324 * 3000.0 / 180.0;

    //pai
    this.pi=3.1415926535897932384626;

    //离心率
    this.ee=0.00669342162296594323;

    //长半轴
    this.a=6378245.0
}


//纬度转换
CoordinateUtil.transformlat= function(lng, lat) {
    var coordinateUtil=new CoordinateUtil();

    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * coordinateUtil.pi) + 20.0 * Math.sin(2.0 * lng * coordinateUtil.pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * coordinateUtil.pi) + 40.0 * Math.sin(lat / 3.0 * coordinateUtil.pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * coordinateUtil.pi) + 320 * Math.sin(lat * coordinateUtil.pi / 30.0)) * 2.0 / 3.0;

    return ret;
};

//经度转换
CoordinateUtil.transformlng= function(lng, lat) {
    var coordinateUtil=new CoordinateUtil();

    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * coordinateUtil.pi) + 20.0 * Math.sin(2.0 * lng * coordinateUtil.pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * coordinateUtil.pi) + 40.0 * Math.sin(lng / 3.0 * coordinateUtil.pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * coordinateUtil.pi) + 300.0 * Math.sin(lng / 30.0 * coordinateUtil.pi)) * 2.0 / 3.0;

    return ret;
};

//百度转国测局
CoordinateUtil.bd09togcj02=function(bd_lon, bd_lat) {
    var coordinateUtil=new CoordinateUtil();

    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * coordinateUtil.x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * coordinateUtil.x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);

    return {
        lng: gg_lng,
        lat: gg_lat
    }
};

//国测局转百度
CoordinateUtil.gcj02tobd09=function(lng, lat) {
    var coordinateUtil=new CoordinateUtil();

    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * coordinateUtil.x_pi);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * coordinateUtil.x_pi);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;

    return {
        lng: bd_lng,
        lat: bd_lat
    };
};

//国测局转84
CoordinateUtil.gcj02towgs84=function(lng, lat) {
    var coordinateUtil=new CoordinateUtil();

    var dlat = CoordinateUtil.transformlat(lng - 105.0, lat - 35.0);
    var dlng = CoordinateUtil.transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * coordinateUtil.pi;
    var magic = Math.sin(radlat);
    magic = 1 - coordinateUtil.ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((coordinateUtil.a * (1 - coordinateUtil.ee)) / (magic * sqrtmagic) * coordinateUtil.pi);
    dlng = (dlng * 180.0) / (coordinateUtil.a / sqrtmagic * Math.cos(radlat) * coordinateUtil.pi);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return {
        lng: lng * 2 - mglng,
        lat: lat * 2 - mglat
    };
};

//百度转wgs84
CoordinateUtil.bd09towgs84=function(x,y){
    //先转 国测局坐标
    var doubles_gcj = CoordinateUtil.bd09togcj02(x, y); //（x 117.   y 36. ）
    //国测局坐标转wgs84
    var doubles_wgs84 = CoordinateUtil.gcj02towgs84(doubles_gcj.lng, doubles_gcj.lat);
    //返回 纠偏后 坐标

    return doubles_wgs84;
};


//测试
var res = CoordinateUtil.bd09towgs84(113.153461, 22.645211);
console.log(res);