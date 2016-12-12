/// <reference path="../typings/jquery.d.ts" />

function downloadCsv(param) {
    var CsvFileName = 'fujita.csv';
    var textCsv = param.text    || '';
    var charset = param.charset || 'SJIS';

    // 文字コード変換
    var strArray   = ECL.charset.Unicode.parse(textCsv);
    var sjisArray  = ECL.charset.convert_array(strArray, charset);
    var uint8Array = new Uint8Array(sjisArray);

    // バイナリオブジェクト作成
    var blob = new Blob([uint8Array], {
        type: 'text/csv;charset=' + charset + ';'
    });

    // ダウンロード実行
    if (window.navigator.msSaveOrOpenBlob) {
        //IEの場合
        navigator.msSaveBlob(blob, CsvFileName);
    } else {
        //IE以外(Chrome, Firefox)
        var downloadLink = $('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', CsvFileName);
        downloadLink.attr('target', '_blank');
        $('body').append(downloadLink);
        downloadLink[0].click();
        downloadLink.remove();
    }
}

$(function() {
    $('select').material_select();

    $('#textarea').val([
        'field1,field2,field3',
        'りんご,ごりら,らっぱ',
        'ばなな,らっこ,たいこ',
        'ぱいなっぷる,こあら,ちぇろ'
    ].join('\n'));

    $('#btnDownload').click(function() {
        downloadCsv({
            text   : $('#textarea').val(), 
            charset: $('#selectCharset').val()
        });
    });
});