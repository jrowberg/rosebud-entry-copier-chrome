// MIT License
//
// Copyright (c) 2023 Jeff Rowberg
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var rosebudCardContainer = null;
var rosebudCardTabs = null;
var rosebudDetailContainers = null;
var rosebudAnalysisContainer = null;
var rosebudEntryContainer = null;

var rosebudTitle = '';
var rosebudTimestamp = '';
var rosebudAnalysisReflection = '';
var rosebudAnalysisReflectionRaw = '';
var rosebudAnalysisKeyInsight = '';
var rosebudAnalysisKeyInsightRaw = '';
var rosebudAnalysisProverb = '';
var rosebudAnalysisProverbRaw = '';
var rosebudAnalysisFeelingsComma = '';
var rosebudAnalysisPeopleComma = '';
var rosebudAnalysisTopicsComma = '';

var optCollapseQuestionsToOneLine = true;

// title            Entry Title (e.g. "🔧 Fixing Things and Facing Challenges")
// timestamp        Entry Timestamp (e.g. "Monday, November 13th")
// qa_template      Question & Answer entry content, following QA template
// proverb_template Proverb content, following Proverb template (proverb is not always present)
// reflection       Entry Reflection content, wrapped/split with <p> tags
// reflection_raw   Entry Reflection content, raw
// keyinsight       Key Insight content, wrapped/split with <p> tags
// keyinsight_raw   Key Insignt content, raw
// proverb          Proverb content, wrapped/split with <p> tags
// proverb_raw      Proverb content, raw
// feelings_comma   List of feelings, separated by commas (e.g. "Concerned, Excited")
// people_comma     List of people, separated by commas (e.g. "Jeff, Courtney")
// topics_comma     List of topics, separated by commas (e.g. "Career Development, Christmas Shopping")
// question         Single prompt/question, all on one line (1+ per entry)
// answer           Entry text, wrapped/split with <p> tags (1+ per entry)

var templateHtmlMain =
    '<h1>Rosebud Journal Entry</h1>\n' +
    '<h2>{{title}}</h2>\n' +
    '<p><em>{{timestamp}}</em></p>\n' +
    '{{qa_template}}\n' +
    '<h2>Rosebud Journal Analysis</h2>\n' +
    '<h3>Entry Reflection</h3>\n' +
    '{{reflection}}\n' +
    '<h3>Key Insight</h3>\n' +
    '{{keyinsight}}\n' +
    '{{proverb_template}}' +
    '<h3>Feelings</h3>\n' +
    '<p>{{feelings_comma}}</p>\n' +
    '<h3>People</h3>\n' +
    '<p>{{people_comma}}</p>\n' +
    '<h3>Topics</h3>\n' +
    '<p>{{topics_comma}}</p>\n';
var templateHtmlQA =
    '<h3>{{question}}</h3>\n' +
    '<p>{{answer}}</p>\n';
var templateHtmlProverb =
    '<h3>Proverb</h3>\n' +
    '{{proverb}}\n';

var templateMarkdownMain =
    '# Rosebud Journal Entry\n\n' +
    '## {{title}}\n\n' +
    '*{{timestamp}}*\n\n' +
    '{{qa_template}}\n\n' +
    '## Rosebud Journal Analysis\n\n' +
    '### Entry Reflection\n\n' +
    '{{reflection}}\n\n' +
    '### Key Insight\n\n' +
    '{{keyinsight}}\n\n' +
    '{{proverb_template}}' +
    '### Feelings\n\n' +
    '{{feelings_comma}}\n\n' +
    '### People\n\n' +
    '{{people_comma}}\n\n' +
    '### Topics\n\n' +
    '{{topics_comma}}\n\n';
var templateMarkdownQA =
    '### {{question}}\n\n' +
    '{{answer}}';
var templateMarkdownProverb =
    '### Proverb\n\n' +
    '{{proverb}}\n\n';

function rosebudCopy(format) {
    rosebudCardContainer = document.querySelector("div[data-testid='entry-card']");
    rosebudTitle = rosebudCardContainer.querySelector("div div span").innerHTML;
    rosebudTimestamp = rosebudCardContainer.querySelector("p").innerHTML;
    rosebudCardTabs = rosebudCardContainer.querySelectorAll("div[role='tablist'] button");

    // switch to the Analysis tab
    rosebudCardTabs[0].click();
    setTimeout(() => {
        rosebudDetailContainers = rosebudCardContainer.querySelectorAll("div[role='tabpanel']");
        rosebudAnalysisContainer = rosebudDetailContainers[0];

        var rosebudAnalysisBlocks = rosebudAnalysisContainer.querySelectorAll("div.chakra-stack > div");
        //console.log(rosebudAnalysisBlocks);
        rosebudAnalysisReflectionRaw = rosebudAnalysisBlocks[0].querySelectorAll("p.chakra-text")[1].innerHTML;
        rosebudAnalysisReflection = '<p>' + rosebudAnalysisReflectionRaw.replace(/(\r*\n){2,}/g, '</p>\n<p>') + '</p>\n';
        rosebudAnalysisKeyInsightRaw = rosebudAnalysisBlocks[1].querySelectorAll("p.chakra-text")[1].innerHTML;
        rosebudAnalysisKeyInsight = '<p>' + rosebudAnalysisKeyInsightRaw.replace(/(\r*\n){2,}/g, '</p>\n<p>') + '</p>\n';

        if (rosebudAnalysisBlocks.length == 4) {
            // proverb present on some analysis sections
            rosebudAnalysisProverbRaw = rosebudAnalysisBlocks[2].querySelectorAll("p.chakra-text")[1].innerHTML;
            rosebudAnalysisProverb = '<p>' + rosebudAnalysisProverbRaw.replace(/(\r*\n){2,}/g, '</p>\n<p>') + '</p>\n';
        } else {
            rosebudAnalysisProverbRaw = '';
            rosebudAnalysisProverb = '';
        }

        var rosebudAnalysisTagBlocks = rosebudAnalysisBlocks[rosebudAnalysisBlocks.length - 1].querySelectorAll("div > div.css-0");
        //console.log(rosebudAnalysisTagBlocks);
        var rosebudAnalysisFeelingsBlocks = rosebudAnalysisTagBlocks[0].querySelectorAll("div > div span");
        //console.log(rosebudAnalysisFeelingsBlocks);
        var rosebudAnalysisPeopleBlocks = rosebudAnalysisTagBlocks[1].querySelectorAll("div > div span span");
        //console.log(rosebudAnalysisPeopleBlocks);
        var rosebudAnalysisTopicsBlocks = rosebudAnalysisTagBlocks[2].querySelectorAll("div > div span");
        //console.log(rosebudAnalysisTopicsBlocks);

        //console.log("Reflection:", rosebudAnalysisReflectionRaw);
        //console.log("Key Insight:", rosebudAnalysisKeyInsightRaw);
        //console.log("Proverb:", rosebudAnalysisProverbRaw);

        rosebudAnalysisFeelingsComma = '';
        for (i = 1; i < rosebudAnalysisFeelingsBlocks.length; i++) {
            var feeling = rosebudAnalysisFeelingsBlocks[i].innerText;
            //console.log("Feeling " + (i-1) + ":", feeling);
            if (i > 1) rosebudAnalysisFeelingsComma += ", ";
            rosebudAnalysisFeelingsComma += feeling;
        }

        rosebudAnalysisPeopleComma = '';
        for (i = 1; i < rosebudAnalysisPeopleBlocks.length; i++) {
            var person = rosebudAnalysisPeopleBlocks[i].innerText;
            if (person == "+ Add") continue; // skip these
            //console.log("Person " + (i-1) + ":", person);
            if (i > 1) rosebudAnalysisPeopleComma += ", ";
            rosebudAnalysisPeopleComma += person;
        }

        rosebudAnalysisTopicsComma = '';
        for (i = 1; i < rosebudAnalysisTopicsBlocks.length; i++) {
            var topic = rosebudAnalysisTopicsBlocks[i].innerText;
            if (topic == "+ Add") continue; // skip these
            //console.log("Topic " + (i-1) + ":", topic);
            if (i > 1) rosebudAnalysisTopicsComma += ", ";
            rosebudAnalysisTopicsComma += topic;
        }

        // switch to the Entry tab
        rosebudCardTabs[1].click();
    }, 100);
    setTimeout(() => {
        rosebudDetailContainers = rosebudCardContainer.querySelectorAll("div[role='tabpanel']");
        rosebudEntryContainer = rosebudDetailContainers[1];
        rosebudEntryQuestions = rosebudEntryContainer.querySelectorAll("p[data-testid^='entry-card-question-']")
        rosebudEntryAnswers = rosebudEntryContainer.querySelectorAll("p[data-testid^='entry-card-answer-']")

        //console.log("Title:", rosebudTitle);
        //console.log("Time:", rosebudTimestamp);

        var workingQA = '';
        for (i = 0; i < rosebudEntryQuestions.length; i++) {
            var thisQA = templateHtmlQA;
            var question = rosebudEntryQuestions[i].innerHTML;
            var answer = rosebudEntryAnswers[i].innerHTML;
            question = question.replace(/(\r*\n)/g, ' ');
            answer = answer.replace(/(\r*\n){2,}/g, '</p>\n<p>');
            //console.log("Question " + i + ":", rosebudEntryQuestions[i].innerHTML);
            //console.log("Answer " + i + ":", rosebudEntryAnswers[i].innerHTML);
            thisQA = thisQA.replace('{{question}}', question);
            thisQA = thisQA.replace('{{answer}}', answer);
            workingQA += thisQA;
        }

        var workingProverb = '';
        if (rosebudAnalysisProverbRaw != "") {
            workingProverb = templateHtmlProverb;
            workingProverb = workingProverb.replace('{{proverb}}', rosebudAnalysisProverb);
            workingProverb = workingProverb.replace('{{proverb_raw}}', rosebudAnalysisProverbRaw);
        }

        var finalContent = templateHtmlMain;
        finalContent = finalContent.replace('{{title}}', rosebudTitle);
        finalContent = finalContent.replace('{{timestamp}}', rosebudTimestamp);
        finalContent = finalContent.replace('{{qa_template}}', workingQA);
        finalContent = finalContent.replace('{{proverb_template}}', workingProverb);
        finalContent = finalContent.replace('{{reflection}}', rosebudAnalysisReflection);
        finalContent = finalContent.replace('{{reflection_raw}}', rosebudAnalysisReflectionRaw);
        finalContent = finalContent.replace('{{keyinsight}}', rosebudAnalysisKeyInsight);
        finalContent = finalContent.replace('{{keyinsight_raw}}', rosebudAnalysisKeyInsightRaw);
        finalContent = finalContent.replace('{{feelings_comma}}', rosebudAnalysisFeelingsComma);
        finalContent = finalContent.replace('{{people_comma}}', rosebudAnalysisPeopleComma);
        finalContent = finalContent.replace('{{topics_comma}}', rosebudAnalysisTopicsComma);

        const blobHtml = new Blob([finalContent], { type: "text/html" });
        const blobText = new Blob([finalContent], { type: "text/plain" });
        const data = [new ClipboardItem({
            "text/html": blobHtml,
            "text/plain": blobText,
        })];

        navigator.clipboard.write(data).then(
            () => { console.info("Rosebud journal entry copied successfully"); },
            () => { console.error("Rosebud journal entry could not be copied"); }
        );
    }, 200);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "rosebud-copy-html") {
        rosebudCopy("html");
    } else if (request == "rosebud-copy-markdown") {
        rosebudCopy("markdown");
    }
});