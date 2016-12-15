/// <reference path="../typings/jquery.d.ts" />

function downloadCsv(param) {
    var CsvFileName = 'fujita.csv';
    var textCsv = param.text    || '';
    var charset = param.charset || 'SJIS';

    // 文字コード変換
    var strArray  = Encoding.stringToCode(textCsv);
    var convertedArray = Encoding.convert(strArray, {
        to  : charset,
        from: 'UNICODE',
        type: 'array'
    });
    var uint8Array = new Uint8Array(convertedArray);

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

function loadCsv(file, $textBox) {
    var fileReader = new FileReader();

    fileReader.onload = function() {
        var arrayBuffer = fileReader.result;
        // Uint8Array オブジェクトを作成
        var uint8Array = new Uint8Array(arrayBuffer);
        var unicodeArray = Encoding.convert(uint8Array, {
            to: 'UNICODE',
            from: 'AUTO'
        });
        var loadedString = Encoding.codeToString(unicodeArray);
        var fileCharset  = Encoding.detect(uint8Array);
        var msg = 'Loaded ' + fileCharset + ' file.';
        // message for you.
        console.log(msg, '\n', loadedString);

        $textBox.val(loadedString).trigger('autoresize');
        Materialize.updateTextFields();
    };

    // start reading.
    fileReader.readAsArrayBuffer(file);
}

$(function() {
    $('select').material_select();

    $('#textarea').val([
        'field1,field2,field3',
        'りんご,ごりら,らっぱ',
        'ばなな,らっこ,たいこ',
        'ぱいなっぷる,こあら,ちぇろ'
    ].join('\n')).trigger('autoresize');

    // Downloadボタン押下時イベント
    $('#btnDownload').click(function() {
        downloadCsv({
            text   : $('#textarea').val(), 
            charset: $('#selectCharset').val()
        });
    });

    // Loadボタン押下時イベント
    $('#btnLoad').click(function() {
        $('#fileLoad').click();
    });

    // ファイル選択時イベント
    $('#fileLoad').change(function(e) {
        var fileElement = e.target;
        var selectedFile = fileElement.files[0];
        loadCsv(selectedFile, $('#textarea'));
    });

});