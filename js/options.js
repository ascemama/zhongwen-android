/*
 Zhongwen - A Chinese-English Pop-Up Dictionary
 Copyright (C) 2010-2019 Christian Schiller
 https://chrome.google.com/extensions/detail/kkmlkkjojmombglmlpbpapmhcaljjkde
 */

'use strict';

function loadVals() {
    browser.storage.sync.get('options', e => {

        const popupcolor = e.options.popupcolor;
        for (let i = 0; i < document.optform.popupcolor.length; i++) {
            if (document.optform.popupcolor[i].value === popupcolor) {
                document.optform.popupcolor[i].selected = true;
                break;
            }
        }

        if (e.options.tonecolors === 'no') {
            document.optform.tonecolors[1].selected = true;
        } else {
            document.optform.tonecolors[0].selected = true;
        }

        if (e.options.fontSize === 'large') {
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
        if (e.options.zhuyin === 'yes') {
            document.optform.zhuyin[1].selected = true;
        } else {
            document.optform.zhuyin[0].selected = true;
        }

        if (e.options.pleco === 'no') {
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

        if (e.options.simpTrad === 'auto') {
            document.optform.simpTrad[0].selected = true;
        } else {
            document.optform.simpTrad[1].selected = true;
        }
        if (e.options.popupTime !=='undefined') {
            document.optform.popupTime.value = e.options.popupTime;
        }
        else {
            document.optform.popupTime[3].selected = true;
        }
    })
}

function storeVals() {

    const backgroundPage = chrome.extension.getBackgroundPage();
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
    };
    browser.storage.sync.set(save);
    
    backgroundPage.zhongwenMain.options.popupcolor = save.options.popupcolor;
    backgroundPage.zhongwenMain.options.tonecolors = save.options.tonecolors;
    backgroundPage.zhongwenMain.options.fontSize = save.options.fontSize;
    backgroundPage.zhongwenMain.options.skritterTLD = save.options.skritterTLD;
    backgroundPage.zhongwenMain.options.zhuyin = save.options.zhuyin;
    backgroundPage.zhongwenMain.options.pleco = save.options.pleco;
    
    //localStorage['grammar'] = document.optform.grammar.value;
    //backgroundPage.zhongwenMain.options.grammar = localStorage['grammar']; 

    backgroundPage.zhongwenMain.options.simpTrad = save.options.simpTrad;
    backgroundPage.zhongwenMain.options.popupTime = save.options.popupTime;

}

$(function () {
    $('#save').click(storeVals);
});

window.onload = loadVals;
