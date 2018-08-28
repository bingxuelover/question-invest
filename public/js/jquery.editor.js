$(function() {
  //屏幕滚动，左侧栏常驻
  $(window).scroll(function() {
    if ($(document).scrollTop() >= 150) {
      $('.edit-list').css({'position': 'fixed', 'top': '30px', 'left': '40px'})
    } else if ($(document).scrollTop() < 150) {
      $('.edit-list').css({'position': 'absolute', 'top': 0, 'left': 0})
    }
  });
  // 排序
  $('#editArea').sortable({
    handle: ".iconSort",
    stop: function(event, ui) {
      sortNum();
      updatePage(true);
    }
  });
  // 插入输入框
  $('#modalInput').on('shown.bs.modal', function(event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var type = button.data('type');
    $(this).find('.btn-primary').on('click', function() {
      saveInput(this, button, type);
    })
  })
  $('#modalInput').on('hidden.bs.modal', function(e) {
    var $check = $(this).find('#checkInput');
    $check.removeAttr('checked');
    checkInput($check);
  })
  // 加入题库弹层
  $('#myModalCollect').on('shown.bs.modal', function(event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var modal = $(this);
    modal.find('.btn-primary').on('click', function() {
      var container = '#collapse' + modal.find('#dLabel').attr('data-container');
      var title = modal.find('input[name="collect-title"]').val();
      addCollect(button, container, title);
    })
  })
  $('#myModalCollect').on('hidden.bs.modal', function(e) {
    var modal = $(this);
    modal.find('#dLabel').html('题型选择 <span class="caret"></span>');
    modal.find('#dLabel').attr('data-container', '');
    modal.find('input[name="collect-title"]').val('');
    $(this).find('.btn-primary').off('click');
  })
  // 删除收藏
  $('#modalRemove').on('show.bs.modal', function(event) {
    var btn = $(event.relatedTarget);
    $(this).find('.btn-primary').on('click', function() {
      removeCollect(btn);
    });
  });
  $('#modalRemove').on('hidden.bs.modal', function(event) {
    $(this).find('.btn-primary').off('click');
  });
  // 关闭输入框状态
  $('.edit-botton,.edit-list,.edit-questions,.breadcrumb,.m-banner,.edit-select').on('click', function(e) {
    $('.edit-box').each(function(j, e) {
      $(e).removeClass('active').find('.edit-box-span').remove();
    });
  });
})
// 点击左侧添加右侧表格
function addQuestion(e, dataType, titletype, icontype, data, parent) {
  var dataTitle = $(e).attr('data-title');
  var html = '';
  if (titletype) {
    var title = getTitle(dataTitle, dataType);
    html += title;
  }
  html += '<div class="edit-ques-con">';
  var icon = '';
  icon = getIcon(icontype, dataType);
  switch (dataType) {
    case 'single-type':
      if (!data) {
        var dataDefault = [
          {
            'val': 1,
            'txt': '选项1'
          }, {
            'val': 2,
            'txt': '选项2'
          }
        ]
      }
      var dataNow = data
        ? data
        : dataDefault;
      html += '<ul class="ques-list">'
      if (dataNow) {
        for (var j = 0; j < dataNow.length; j++) {
          html += '  <li class="form-inline">'
          html += '    <input type="radio" class="radio" name="singleradio" value="">'
          html += '    <div class="inline-div">'
          html += '      <div class="edit-ques-div edit-box" contenteditable="true" onclick="editDiv(event,this,2)" data-val="' + dataNow[j].val + '">' + dataNow[j].txt + '</div>'
          html += '    </div>'
          html += '  </li>'
        }
      }
      if (data) {
        html += '<a class="save-select" href = "javascript:void(0);" onclick="saveEditSelect(this)">完成编辑</a>';
      }
      html += '</ul>';
      break;
    case 'checkbox-type':
      if (!data) {
        var dataDefault = [
          {
            'val': 1,
            'txt': '选项1'
          }, {
            'val': 2,
            'txt': '选项2'
          }
        ]
      }
      var dataNow = data
        ? data
        : dataDefault;
      html += '<ul class="ques-list">'
      if (dataNow) {
        for (var j = 0; j < dataNow.length; j++) {
          html += '  <li class="form-inline">'
          html += '    <input type="checkbox" class="checkbox" name="checkboxtype" value="">'
          html += '    <div class="inline-div">'
          html += '      <div class="edit-ques-div edit-box" contenteditable="true" onclick="editDiv(event,this,2)" data-val="' + dataNow[j].val + '">' + dataNow[j].txt + '</div>'
          html += '    </div>'
          html += '  </li>'
        }
      }
      html += '</ul>';
      break;
    case 'select-type':
      if (!data) {
        var dataDefault = [
          {
            'val': 1,
            'txt': '选项1'
          }, {
            'val': 2,
            'txt': '选项2'
          }
        ]
      }
      var dataNow = data
        ? data
        : dataDefault;
      html += '<div class="edit-seclect-div">'
      html += '<select class="form-control select-list" name="selecttype">'
      if (dataNow) {
        for (var j = 0; j < dataNow.length; j++) {
          html += '<option value="' + dataNow[j].val + '">' + dataNow[j].txt + '</option>'
        }
      }
      html += '</select>'
      html += '<a href="javascript:void(0)" onclick="editSelect(this)">编辑选项</a>'
      html += '</div>'
      break;
    case 'text-type':
      html += '<div class="edit-text-div">'
      html += '<input type="text" class="form-control" name="txttype" value="">'
      html += '</div>'
      break;
    case 'list-type':
      html += '<div class="edit-text-div">'
      html += '<textarea name="listtype" class="form-control" rows="5" cols="80"></textarea>'
      html += '</div>'
      break;
    case 'line-radio':
      var dataDefault = {
        'type': [
          {
            'val': 1,
            'txt': '满意度'
          }, {
            'val': 2,
            'txt': '认同度'
          }, {
            'val': 3,
            'txt': '重要度'
          }, {
            'val': 4,
            'txt': '愿意度'
          }, {
            'val': 5,
            'txt': '符合度'
          }, {
            'val': 6,
            'txt': '自定义'
          }
        ],
        'number': 10
      }
      var dataNow = data
        ? data
        : dataDefault;
      html += '<div class="form-inline">'
      html += '  <input type="number" class="form-control mr10 f12" min="1" max="" name="linetxt" value="' + dataNow.number + '">'
      html += ' <select class="form-control mr10 select f12" name="lineselect" onchange="selectCustom(this)">'
      var typeThis = dataDefault.type;
      for (var j = 0; j < typeThis.length; j++) {
        var sel = "";
        if (data) {
          if (typeThis[j].txt === data.type) {
            sel = "selected";
          }
        }
        html += '<option value="' + typeThis[j].val + '" ' + sel + '>' + typeThis[j].txt + '</option>'
      }
      html += '  </select>'
      html += '  <input type="checkbox" class="checkbox" name="linecheckbox" value=""> 是否有其它'
      html += '</div>'
      break;
    case 'table-radio':
      html += '<div class="form-group table-edit-box">'
      html += '<table class="table table-bordered form-inline">';
      html += '<thead><tr class="table-edit-title"><td>&nbsp;</td><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,3)">选项1</div></td><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,3)">选项2</div></td></tr></thead>';
      html += '<tbody>';
      html += '<tr><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,4)">矩阵行1</div></td><td><label><input type="radio" name="blankRadios1" id="" value="1" aria-label="..."></label></td>';
      html += '<td><label><input type="radio" name="blankRadios1" id="" value="2" aria-label="..."></label></td></tr>';
      html += '<tr><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,4)">矩阵行2</div></td><td><label><input type="radio" name="blankRadios2" id="" value="1" aria-label="..."></label></td>';
      html += '<td><label><input type="radio" name="blankRadios2" id="" value="2" aria-label="..."></label></td></tr>';
      html += '</tbody></table></div>';
      icon = getIcon(icontype, dataType, true);
      break;
    case 'table-checkbox':
      html += '<div class="form-group table-edit-box">'
      html += '<table class="table table-bordered form-inline">';
      html += '<thead><tr class="table-edit-title"><td>&nbsp;</td><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,3)">选项1</div></td><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,3)">选项2</div></td></tr></thead>';
      html += '<tbody>';
      html += '<tr><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,4)">矩阵行1</div></td><td><label><input type="checkbox" name="blankcheck1" id="" value="1" aria-label="..."></label></td>';
      html += '<td><label><input type="checkbox" name="blankcheck1" id="" value="2" aria-label="..."></label></td></tr>';
      html += '<tr><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,4)">矩阵行2</div></td><td><label><input type="checkbox" name="blankcheck2" id="" value="1" aria-label="..."></label></td>';
      html += '<td><label><input type="checkbox" name="blankcheck2" id="" value="2" aria-label="..."></label></td></tr>';
      html += '</tbody></table></div>';
      icon = getIcon(icontype, dataType, true);
      break;
    case 'single-img':
      html += '<div class="row img-list">';
      html += '<div class="add-img-area col-sm-3 col-md-3"><div class="thumbnail"  onclick="addLine(this,\'single-img\',\'images/ma.png\')"><img src="images/upload-img-icon.png" alt="..."><div class="caption"><p>点击上传图片</p><p class="font-remark">最多可上传50张图片</p></div></div></div>';
      html += '</div>';
      break;
    case 'list-img':
      html += '<div class="row img-list">';
      html += '<div class="add-img-area col-sm-3 col-md-3"><div class="thumbnail"  onclick="addLine(this,\'list-img\',\'images/ma.png\')"><img src="images/upload-img-icon.png" alt="..."><div class="caption"><p>点击上传图片</p><p class="font-remark">最多可上传50张图片</p></div></div></div>';
      html += '</div>';
      break;
    case 'textarea-type':
      html += '<div class="edit-box text-edit-box" onclick="editDiv(event,this,1)" contenteditable="true">描述说明</div>';
      break;
    case 'page-line':
      var p = $('.page-line-id').length + 1;
      html += '<div class="page-line-id" page=' + p + '></div>';
      html += '<div class="page-line-area">页码：' + p + '/' + (
      p + 1) + '</div>';
      updatePage();
      break;
    default:
      break;
  }
  html += icon;
  html += '</div>';

  if (parent) {
    var appendHtml = document.createElement('div');
    appendHtml.innerHTML = html;
    $(parent).append(appendHtml);
  } else {
    var appendHtml = document.createElement('div');
    appendHtml.className = 'edit-con-box';
    appendHtml.innerHTML = html;
    $('#editArea').append(appendHtml);
    if (!top) {
      var top = $(document).height() - $(window).height();
      $(document).scrollTop(top);
    }
  }
}
function getTitle(dataTitle, dataType) {
  var htmlTitle = '';
  var len = $('.edit-ques-title').length + 1;
  htmlTitle += '<div class="edit-ques-title">';
  htmlTitle += '<span class="edit-ques-num" name="" data-role="1">Q' + len + '</span>';
  htmlTitle += '<div class="inline-div">';
  htmlTitle += '<div class="edit-box" contenteditable="true" data-type="' + dataType + '" data-name="' + dataTitle + '" onclick="editDiv(event,this,1)">' + dataTitle + '</div>';
  htmlTitle += '</div></div>';
  return htmlTitle;
}
function getIcon(bool, type, table) {
  var conIcon = ''
  if (table) {
    conIcon += '<div class="edit-table-add">'
    conIcon += ' <span class="glyphicon glyphicon-plus iconAdd" title="增加" aria-hidden="true" onclick="addRows(this, \'' + type + '\')"></span>'
    conIcon += '</div>'
  }
  conIcon += '<div class="edit-type-area">'
  if (bool === 1) {
    conIcon += '<div class="edit-icon-add">'
    conIcon += ' <span class="glyphicon glyphicon-plus iconAdd" title="增加" aria-hidden="true" onclick="addLine(this, \'' + type + '\')"></span>'
    conIcon += ' <span class="glyphicon glyphicon-tasks" title="批量增加"></span>'
    conIcon += '</div>'
  }
  conIcon += '<div class="edit-icon-list">'
  conIcon += '<span class="glyphicon glyphicon-move iconSort" title="移动" aria-hidden="true"></span>'
  if (bool !== 3) {
    conIcon += '<span class="glyphicon glyphicon-random" title="逻辑设置" aria-hidden="true" data-toggle="modal" data-target="#myModalSet"></span>'
    conIcon += '<span class="glyphicon glyphicon-duplicate" title="复制" aria-hidden="true" onclick="surveyCopy(this)"></span>'
    conIcon += '<span class="glyphicon glyphicon-list" title="操作" aria-hidden="true" data-toggle="modal" data-target="#myModalQuestion"></span>'
  }
  conIcon += '<span class="glyphicon glyphicon-trash" title="删除" aria-hidden="true" onclick="surveyDelete(this)"></span>'
  conIcon += '<span class="glyphicon glyphicon-heart-empty" title="收藏" aria-hidden="true" onclick="addCollect(this,\'#collapse0\')"></span>'
  conIcon += '<span class="glyphicon glyphicon-import" title="加入题库" aria-hidden="true" data-toggle="modal" data-target="#myModalCollect"></span>'
  conIcon += '</div>';
  conIcon += '</div>';
  return conIcon;
}
// 点击选中编辑
function editDiv(event, elm, type) {
  // event.stopPropagation();
  if (!$(elm).hasClass('active')) {
    $('.edit-box').each(function(j, e) {
      $(e).removeClass('active').find('.edit-box-span').remove();
    });
    $(elm).addClass('active');
    var div = document.createElement('div');
    div.className = 'edit-box-span';
    var html = '';
    switch (type) {
      case 1:
        html += '<span class="glyphicon glyphicon-picture" title="图片"></span>';
        break;
      case 2:
        html += '<span class="glyphicon glyphicon-picture" title="图片"></span>';
        html += '<span class="glyphicon glyphicon-list" title="操作" data-toggle="modal" data-target="#modalInput" data-type="list"></span>';
        html += '<span class="glyphicon glyphicon-trash" title="删除" onclick="delElement(this,\'list\')"></span>';
        html += '<span class="glyphicon glyphicon-arrow-up" title="上移" onclick="moveUp(this)"></span>';
        html += '<span class="glyphicon glyphicon-arrow-down" title="下移" onclick="moveDown(this)"></span>';
        break;
      case 3:
        html += '<span class="glyphicon glyphicon-trash" title="删除" onclick="delElement(this,\'tablecol\')"></span>';
        html += '<span class="glyphicon glyphicon-list" title="操作" data-toggle="modal" data-target="#modalInput" data-type="table"></span>';
        break;
      case 4:
        html += '<span class="glyphicon glyphicon-trash" title="删除" onclick="delElement(this,\'tablerow\')"></span>';
        html += '<span class="glyphicon glyphicon-arrow-up" title="上移" onclick="moveUp(this,\'table\')"></span>';
        html += '<span class="glyphicon glyphicon-arrow-down" title="下移" onclick="moveDown(this,\'table\')"></span>';
        break;
      default:
        return false;
    }
    div.innerHTML = html;
    $(elm).append(div);
  }
  return false;
}
// 重新排序数字
function sortNum() {
  $('.edit-ques-num').each(function(i, elm) {
    var hnum = (i + 1);
    $(elm).html('Q' + hnum).attr('data-role', hnum);
  });
}
function updatePage(type) {
  if (type) {
    var p = $('.page-line-area').length;
    $('.page-line-area').each(function(i, elm) {
      var hnum = (i + 1);
      $(elm).html('页码：' + hnum + '/' + p + '');
    });
  } else {
    var p = $('.page-line-area').length + 1;
    $('.page-line-area').each(function(i, elm) {
      var hnum = (i + 1);
      if ((hnum + 1) === p) {
        hnum = p
      }
      $(elm).html('页码：' + hnum + '/' + p + '');
    });
  }

}
// 添加新行
function addLine(elm, type, url) {
  var html = '';
  switch (type) {
    case 'single-type':
      var $parent = $(elm).parents('.edit-con-box').find('.ques-list');
      var i = $parent.children('li:visible').length + 1;
      html += '  <li class="form-inline">'
      html += '    <input type="radio" class="radio" name="singleradio" value="">'
      html += '    <div class="inline-div">'
      html += '      <div class="edit-ques-div edit-box" contenteditable="true" onclick="editDiv(event,this,2)">选项' + i + '</div>'
      html += '    </div>'
      html += '  </li>'
      $parent.append(html);
      break;
    case 'checkbox-type':
      var $parent = $(elm).parents('.edit-con-box').find('.ques-list');
      var i = $parent.children().length + 1;
      html += '  <li class="form-inline">'
      html += '    <input type="checkbox" class="checkbox" name="checkboxtype" value="">'
      html += '    <div class="inline-div">'
      html += '      <div class="edit-ques-div edit-box" contenteditable="true" onclick="editDiv(event,this,2)">选项' + i + '</div>'
      html += '    </div>'
      html += '  </li>'
      $parent.append(html);
      break;
    case 'table-radio':
      var $parent = $(elm).parents('.edit-con-box').find('tbody');
      var $top = $parent.prev('thead').find('td');
      var i = $parent.children('tr').length + 1;
      var j = $parent.children('tr:first-child').children('td').length;
      html += '<tr><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,4)">矩阵行' + i + '</div></td>';
      for (var y = 1; y < j; y++) {
        html += '<td><label>';
        html += '<input type="radio" name="blankRadios' + i + '" id="" value="' + y + '" aria-label="...">';
        if ($top.eq(y).attr('has-other') === 'Y') {
          html += '<input type="text" class="form-control edit-box-input">';
        }
        html += '</label></td>';
      }
      html += '</tr>';
      $parent.append(html);
      break;
    case 'table-checkbox':
      var $parent = $(elm).parents('.edit-con-box').find('tbody');
      var $top = $parent.prev('thead').find('td');
      var i = $parent.children('tr').length + 1;
      var j = $parent.children('tr:first-child').children('td').length;
      html += '<tr><td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,4)">矩阵行' + i + '</div></td>';
      for (var y = 1; y < j; y++) {
        html += '<td><label>';
        html += '<input type="checkbox" name="blankcheck' + i + '" id="" value="' + (
        y + 1) + '" aria-label="...">';
        if ($top.eq(y).attr('has-other') === 'Y') {
          html += '<input type="text" class="form-control edit-box-input">';
        }
        html += '</label></td>';
      }
      html += '</tr>';
      $parent.append(html);
      break;
    case 'single-img':
      var $sibling = $(elm).parent('.add-img-area');
      var i = $sibling.parent().children().length;
      html += '<div class="col-sm-3 col-md-3"><div class="thumbnail">';
      html += '<span class="glyphicon glyphicon-trash del-img" onclick="delElement(this,\'img\')"></span>';
      html += '<img src="' + url + '" alt="...">';
      html += '<div class="radio"><label><input type="radio" name="imgRadios" value=""></label><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,3)">选项' + i + '</div></div>';
      html += '</div></div>';
      $(html).insertBefore($sibling);
      break;
    case 'list-img':
      var $sibling = $(elm).parent('.add-img-area');
      var i = $sibling.parent().children().length;
      html += '<div class="col-sm-3 col-md-3"><div class="thumbnail">';
      html += '<span class="glyphicon glyphicon-trash del-img" onclick="delElement(this,\'img\')"></span>';
      html += '<img src="' + url + '" alt="...">';
      html += '<div class="checkbox"><label><input type="checkbox" name="imgCheckbox" value=""></label><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,3)">选项' + i + '</div></div>';
      html += '</div></div>';
      $(html).insertBefore($sibling);
      break;
    default:
      return false;
  }
}
function addRows(elm, type) {
  var html = '';
  switch (type) {
    case 'table-radio':
      var $parent = $(elm).parents('.edit-con-box').find('tr');
      var j = $parent.eq(0).children('td').length;
      var i = $parent.length;
      $parent.each(function(x, elm) {
        if (x === 0) {
          html = '<td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,3)">选项' + j + '</div></td>';
        } else {
          html = '<td><label><input type="radio" name="blankRadios' + x + '" id=" " value="' + j + '" aria-label=" ..."></label></td>';
        }
        $(elm).append(html);
      });
      break;
    case 'table-checkbox':
      var $parent = $(elm).parents('.edit-con-box').find('tr');
      var j = $parent.eq(0).children('td').length;
      var i = $parent.length;
      $parent.each(function(x, elm) {
        if (x === 0) {
          html = '<td><div class="edit-box" contenteditable="true" onclick="editDiv(event,this,3)">选项' + j + '</div></td>';
        } else {
          html = '<td><label><input type="checkbox" name="blankcheck' + x + '" id=" " value="' + j + '" aria-label=" ..."></label></td>';
        }
        $(elm).append(html);
      });
      break;
    default:
      return false;
  }
}
// 复制题目
function surveyCopy(elm, type) {
  var $html = $(elm).parents('.edit-con-box');
  $html.clone().insertAfter($html);
  sortNum();
}
// 删除题目
function surveyDelete(elm) {
  var $html = $(elm).parents('.edit-con-box');
  $html.remove();
}
// 题目内排序
function moveUp(elm, type) {
  if (type === 'table') {
    var $parent = $(elm).parents('tr');
  } else {
    var $parent = $(elm).parents('.form-inline');
  }
  var $prev = $parent.prev();
  if ($prev.length > 0) {
    $parent.insertBefore($prev);
  }
}
function moveDown(elm, type) {
  if (type === 'table') {
    var $parent = $(elm).parents('tr');
  } else {
    var $parent = $(elm).parents('.form-inline');
  }
  var $next = $parent.next();
  if ($next.length > 0) {
    $parent.insertAfter($next);
  }
}
// 题目内编辑
function checkInput(elm) {
  var $next = $(elm).parents('.checkbox').next('.checkbox');
  if ($(elm).is(':checked')) {
    $next.removeClass('hide');
  } else {
    $next.addClass('hide');
  }
}
// 题目内删除
function delElement(elm, type) {
  switch (type) {
    case 'list':
      $(elm).parents('.form-inline').remove();
      break;
    case 'img':
      $(elm).parent('.thumbnail').parent().remove();
      break;
    case 'tablecol':
      var $td = $(elm).parents('td');
      var $parent = $td.parents('table');
      var index = $td.index();
      $parent.find('tr').each(function(i, el) {
        $(el).children('td').eq(index).remove();
      });
      break;
    case 'tablerow':
      var $parent = $(elm).parents('tr');
      $parent.remove();
      break;
    default:
      return false;
  }
}
// 题目内保存
function saveInput(modal, btn, type) {
  var input = '<input type="text" class="form-control edit-box-input">';
  if (type === 'table') {
    var td = $(btn).parents('td');
    var $parent = td.parents('thead').next('tbody');
    var index = td.index();
    $parent.find('tr').each(function(i, el) {
      var elm = $(el).children('td').eq(index).children('label');
      if ($(modal).parents('.modal-content').find('#checkInput').is(':checked')) {
        if (elm.find('input:text').length <= 0) {
          elm.append(input);
          td.attr('has-other', 'Y');
        }
      } else {
        elm.find('input:text').remove();
        td.attr('has-other', 'N');
      }
    });
  } else {
    var elm = $('.edit-box-span').parents('.edit-box');
    if ($(modal).parents('.modal-content').find('#checkInput').is(':checked')) {
      if (elm.find('input:text').length <= 0) {
        elm.append(input);
      }
    } else {
      elm.find('input:text').remove();
    }
  }
  $('#modalInput').modal('hide');
}
// 编辑select
function editSelect(e) {
  var parent = $(e).parents('.edit-con-box');
  var data = [];
  parent.find('.select-list option').each(function(i, e) {
    data.push({'val': $(e).val(), 'txt': $(e).text()});
  })
  parent.find('.edit-ques-con').hide();
  addQuestion(e, 'single-type', false, 1, data, parent);
}
function saveEditSelect(e) {
  var parent = $(e).parents('.edit-ques-con').parent();
  var prev = parent.prev('.edit-ques-con');
  var data = [];
  parent.find('.edit-box').each(function(i, e) {
    data.push({'val': $(e).attr('data-val'), 'txt': $(e).text()});
  });
  parent.remove();
  var options = '';
  for (var j = 0; j < data.length; j++) {
    options += '<option value="' + data[j].val + '">' + data[j].txt + '</option>'
  }
  prev.find('.select-list').html(options);
  prev.show();
}
function selectCustom(elm) {
  if ($(elm).val() === '6') {
    var html = '<input type="text" class="form-control" name="sel-start">';
    html += ' - ';
    html += '<input type="text" class="form-control" name="sel-end">';
    var sel = document.createElement('div');
    sel.className = 'form-group';
    sel.id = 'selSet';
    sel.innerHTML = html;
    $(sel).insertAfter($(elm));
  } else {
    if ($('#selSet').length > 0) {
      $('#selSet').remove();
    }
  }
}
/* 题库相关 */
//初始化右侧的题库悬浮提示框
$('[data-toggle="popover"]').popover({'html': true, 'placement': 'left', 'trigger': 'hover'});
//删除收藏
function removeCollect(el) {
  $(el).parent('li').remove();
  $('#modalRemove').modal('hide');
}
// 添加收藏
function addCollect(btn, container, title) {
  var has = true;
  $(container).collapse('show');
  if (title) {
    $('#myModalCollect').modal('hide');
    has = false;
  }
  var parent = $(container).find('ul');
  var tabindex = parent.children('li').length;
  var element = $(btn).parents('.edit-con-box').children('.edit-ques-title').children('.inline-div').children('.edit-box');
  if (!title && title !== '') {
    var title = element.attr('data-name');
  }
  var dataType = element.attr('data-type');
  // 根据保存题目的内容修改
  var dataList = [
    {
      'val': 1,
      'txt': '2000以下'
    }, {
      'val': 2,
      'txt': '2000-5000'
    }, {
      'val': 3,
      'txt': '5001-8000'
    }, {
      'val': 4,
      'txt': '8001-10000'
    }, {
      'val': 5,
      'txt': '10000以上'
    }
  ]
  var li = document.createElement('li');
  var html = '';
  html += '<div class="panel-body-title" data-title="' + title + '">';
  html += '<span class="glyphicon glyphicon-list" aria-hidden="true"></span>';
  html += '' + title + '</div>';
  html += '<a class="glyphicon glyphicon-info-sign" href="javascript:void(0)" role="button" tabindex="' + tabindex + '" data-toggle="popover" data-content="' + title + '"></a>';
  if (has) {
    html += '<span class="glyphicon glyphicon-remove-circle icon-remove" data-toggle="modal" data-target="#modalRemove"></span>';
  }
  li.innerHTML = html;
  parent.append(li);
  // 手动绑定点击事件
  $(li).find('.panel-body-title').click(function(event) {
    // addQuestion里的参数要根据需要生成
    addQuestion(this, dataType, true, 2, dataList);
  });
  // 初始化浮出层效果
  $(li).find('.glyphicon-info-sign').popover({'html': true, 'placement': 'left', 'trigger': 'hover'});
}
