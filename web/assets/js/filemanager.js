// -------------------------------------------------- MESSAGE BOX
/**
 * add a message to the message box. context and type can be omitted.
 */
function add_msg(msg, context, type) {
    context = typeof context !== 'undefined' ? context : 'Info';
    type = typeof type !== 'undefined' ? type : 'alert-info';

    $('div#msgbox').html(
        $('<div />').addClass('alert').addClass(type).append(
            '<a class="close" data-dismiss="alert">&times;</a>',
            '<strong>' + context + ':</strong> ' + msg
        )
    );
}

// -------------------------------------------------- BROWSE
/**
 * set breadcrumb according to PATH.
 */
function set_breadcrumb() {
    // add parts
    var parts = PATH.split('/');
    var html = '';
    var link = '';
    for (var i = 0; i < parts.length; i++) {
        if (i != parts.length - 1) {
            link += i == 0 ? parts[i] : '/' + parts[i];
            html += '<li><a href="' + link + '">' + parts[i] + '</a></li>';
        } else {
            html += '<li class="active">' + parts[i] + '</li>';
        }
    }
    $('ol#breadcrumb').html(html);

    // register click event
    $('ol#breadcrumb a').click(function (e) {
        e.preventDefault();
        browse($(e.target).attr('href'));
    });
}

/**
 * do the ajax request for the new path.
 */
function browse(path) {
    $.ajax({
        url: 'file-manager.php?path=' + path,
        cache: false,
        dataType: 'json',
        success: function (result) {
            if (result.status)
                show_content(path, result.files);
            else
                add_msg(result.msg, 'PHP', 'alert-danger');
        },
        error: function (jqXHR, status) {
            add_msg(status, 'AJAX', 'alert-danger');
        }
    });
}

/**
 * ajax success callback, set path and add content to table.
 */
function show_content(path, files) {
    PATH = path;
    set_breadcrumb();

    $('table#filemanager').empty();

    for (var i = 0; i < files.length; i++) {
        var f = files[i];

        if (f.folder) {
            f.icon = 'icon-folder-close';
            f.name = $('<a />').attr('href', f.link).text(f.name).click(function (e) {
                e.preventDefault();
                browse($(e.target).attr('href'));
            });
            f.edit = '';
        } else {
            f.icon = 'icon-file';
            f.name = '<a href="./download.php?file=' + f.link + '">' + f.name + '</a>';
        }

        $('table#filemanager').append(
            $('<tr />').append(
                $('<td />').append('<i class="' + f.icon + '"></i> ', f.name),
                $('<td />').text(f.size),
                $('<td />').text(f.date),
                $('<td />').text(f.perm)
            )
        );
    }
}

$('div#tools a#refresh-button').click(function (e) {
    browse(PATH);
});

$('div#tools a#clear-msgbox-button').click(function (e) {
    $('div#msgbox').empty();
});