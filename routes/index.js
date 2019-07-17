let routes = [
{
  method: 'GET',
  path:'/',
  handler: (request, h) => {
    return h.view('index');
  }
}
,{
  method: 'GET',
  path:'/q',
  handler: (request, h) => {
    return 'Q World!';
  }
}
,{
  method: '*',
  path: '/{any*}',
  handler: function (request, h) {
    return '404 Error! Page Not Found!';
  }
}
]
module.exports = routes