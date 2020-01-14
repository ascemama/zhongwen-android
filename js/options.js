/*
 Zhongwen - A Chinese-English Pop-Up Dictionary
 Copyright (C) 2010-2019 Christian Schiller
 https://chrome.google.com/extensions/detail/kkmlkkjojmombglmlpbpapmhcaljjkde
 */

'use strict';

function loadVals() {
    browser.storage.sync.get('options', e => {
        //if first time, need to get the default value from the main object
        if (JSON.stringify(e) == "{}") {
            browser.runtime.getBackgroundPage().then(b => {
                fillForm(b.zhongwenMain.options);
            });
        }
        else {
            fillForm(e.options)
        }
    })
}



function fillForm(opt) {
    const popupcolor = opt.popupcolor;
    for (let i = 0; i < document.optform.popupcolor.length; i++) {
        if (document.optform.popupcolor[i].value === popupcolor) {
            document.optform.popupcolor[i].selected = true;
            break;
        }
    }
    if (opt.tonecolors === 'no') {
        console.log("loadVals:opt.tonecolor=" + opt.tonecolors);
        document.optform.tonecolors[1].selected = true;
    } else {
        document.optform.tonecolors[0].selected = true;
    }

    if (opt.fontSize === 'large') {
        document.optform.fontSize[1].selected = true;
    } else {
        document.optform.fontSize[0].selected = true;
    }
    /* For now no skritter
        if (localStorage['skritterTLD'] === 'cn') {
            document.optform.skritterTLD[1].selected = true;
        } else {
            document.optform.skritterTLD[0].selected = true;
        }
    */
    if (opt.zhuyin === 'yes') {
        document.optform.zhuyin[1].selected = true;
    } else {
        document.optform.zhuyin[0].selected = true;
    }

    if (opt.pleco === 'no') {
        document.optform.pleco[1].selected = true;
    } else {
        document.optform.pleco[0].selected = true;
    }

    /* For now no grammar
    if (localStorage['grammar'] === 'no') {
        document.optform.grammar[1].selected = true;
    } else {
        document.optform.grammar[0].selected = true;
    }
    */

    if (opt.simpTrad === 'auto') {
        document.optform.simpTrad[1].selected = true;
    } else {
        document.optform.simpTrad[0].selected = true;
    }
    if (opt.popupTime !== 'undefined') {
        document.optform.popupTime.value = opt.popupTime;
    }
    else {
        document.optform.popupTime[3].selected = true;
    }

}

function storeVals() {


    let save = {
        options: {
            'popupcolor': document.optform.popupcolor.value,
            'tonecolors': document.optform.tonecolors.value,
            'fontSize': document.optform.fontSize.value,
            'skritterTLD': 'com',
            'zhuyin': document.optform.zhuyin.value,
            'grammar': 'no',
            'popupTime': document.optform.popupTime.value,
            'simpTrad': document.optform.simpTrad.value,
            'pleco': document.optform.pleco.value
        }
    }

    browser.storage.sync.set(save);

    browser.runtime.getBackgroundPage().then(e => {
        e.zhongwenMain.options.popupcolor = save.options.popupcolor;
        e.zhongwenMain.options.tonecolors = save.options.tonecolors;
        e.zhongwenMain.options.fontSize = save.options.fontSize;
        e.zhongwenMain.options.skritterTLD = save.options.skritterTLD;
        e.zhongwenMain.options.zhuyin = save.options.zhuyin;
        e.zhongwenMain.options.pleco = save.options.pleco;

        //localStorage['grammar'] = document.optform.grammar.value;
        //e.zhongwenMain.options.grammar = localStorage['grammar']; 

        e.zhongwenMain.options.simpTrad = save.options.simpTrad;
        e.zhongwenMain.options.popupTime = save.options.popupTime;
    });

}

$(function () {
    $('#save').click(storeVals);
});

window.onload = loadVals;
