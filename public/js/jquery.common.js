$(function () {
  // 自适应浏览器高度
  var hWin = $(window).height();
  var hDoc = $('.wapper').height();
  if (hWin > hDoc) {
    var h = hWin - 205;
    $('#page-height').css('min-height', h);
  }
  //下拉列表事件
  $('.dropdown').each(function(index, el) {
    $(el).children('.dropdown-menu').on('click','li', function(event) {console.log('click');
      var txt = $(el).children('button').children('.dropdown-txt');
      var text = $(this).children('a').text();
      txt.text(text);
    });
  });
})
