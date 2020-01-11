/*
        Zhongwen - A Chinese-English Popup Dictionary
        Original Work Copyright (C) 2011 Christian Schiller
        https://chrome.google.com/extensions/detail/kkmlkkjojmombglmlpbpapmhcaljjkde
        Modified work Copyright (C) 2017 Leonard Lausen
        https://github.com/leezu/zhongwen
        Modified work Copyright (C) 2019 Antoine Scemama
        https://github.com/ascemama/zhongwen

        ---

        Originally based on Rikaikun 0.8
        Copyright (C) 2010 Erek Speed
        http://code.google.com/p/rikaikun/

        ---

        Originally based on Rikaichan 1.07
        by Jonathan Zarate
        http://www.polarcloud.com/

        ---

        Originally based on RikaiXUL 0.4 by Todd Rudick
        http://www.rikai.com/
        http://rikaixul.mozdev.org/

        ---

        This program is free software; you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation; either version 2 of the License, or
        (at your option) any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with this program; if not, write to the Free Software
        Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

        ---

        Please do not change or remove any of the copyrights or links to web pages
        when modifying any of the files.

*/
function reportError(error) {
  console.error(`Error: ${error}`);
}
function ignoreError(error) {}

var zhongwenMain = {

    altView: 0,

    tabIDs: {},

    loadDictionary: async function() {
      let dictData = await loadDictData();
      return new ZhongwenDictionary(...dictData);
    },
    init: function(){
      let optionsPromise = browser.storage.sync.get({
        options: {
          'popupcolor': 'lightblue',
          'tonecolors': 'yes',
          'fontSize': 'small',
          'skritterTLD': 'com',
          'zhuyin': 'no',
          'grammar': 'no',
          'popupTime':4,
          'simpTrad':'auto',
          'pleco':'yes'
        }
      })
      //let optionsPromise = browser.storage.sync.get(options);
      //let optionsPromise = browser.storage.sync.get();
      let dictionaryPromise = zhongwenMain.loadDictionary()
  
      Promise.all([optionsPromise, dictionaryPromise]).then(
        ([storage, dictionary]) => {
  
          this.dict = dictionary;
         /* if(storage.options=={}){
            this.options= {
              'popupcolor': 'blue',
              'tonecolors': 'yes',
              'fontSize': 'small',
              'skritterTLD': 'com',
              'zhuyin': 'no',
              'grammar': 'no',
              'popupTime':4,
              'simpTrad':'auto',
              'pleco':'yes'
            };
          } */
          //else{
          this.options=storage.options;
          //}
        });

    },
 
    search: function(text) {

        var entry = this.dict.wordSearch(text);
        if (entry != null) {
            for (var i = 0; i < entry.data.length; i++) {
                var word = entry.data[i][1];
                if (this.dict.hasKeyword(word) && (entry.matchLen == word.length)) {
                    // the final index should be the last one with the maximum length
                    entry.grammar = { keyword: word, index: i };
                }
            }
        }

        return entry;

    },

    //not use for now, maybe later
  wordlistTab: function() {
    var url = browser.extension.getURL("/wordlist.html");
    var tabID = zhongwenMain.tabIDs['wordlist'];
    if (tabID) {
      browser.tabs.get(tabID, function(tab) {
        if (tab && (tab.url.substr(-13) == 'wordlist.html')) {
          browser.tabs.reload(tabID);
          browser.tabs.update(tabID, {active: true});
        } else {
          browser.tabs.create({
            url: url
          }, function(tab) {
            zhongwenMain.tabIDs['wordlist'] = tab.id;
            browser.tabs.reload(tab.id);
          });
        }
      });
    } else {
      browser.tabs.create({ url: url }, function(tab) {
        zhongwenMain.tabIDs['wordlist'] = tab.id;
        browser.tabs.reload(tab.id); });
    }
  }
};


//browser.tabs.getCurrent().then(t => { zhongwenMain.enable(t);});
zhongwenMain.init();