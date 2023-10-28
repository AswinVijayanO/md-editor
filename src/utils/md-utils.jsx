import React from "react";

const breakLines = (story) => {
  if (story) {
    return story.split('\n')
  }
  return []
}
const duplicateCharCount = (str) => {
  if (str) {
    var obj = {};
    for (let i = 0; i < str.length; i++) {
      if (obj[str[i]]) {
        obj[str[i]] += obj[str[i]];
      } else {
        obj[str[i]] = 1;
      }
    }
    return obj
  }

}
function startsString(inputString, symbol) {
  let count = 0;
  for (let i = 0; i < inputString.length; i++) {
    if (inputString[i] === symbol) {
      count++;
    } else {
      break; // Exit the loop when a non-# character is encountered
    }
  }
  return count;
}
function extractTextInSBrackets(inputString) {
  const regex = /\[(.*?)\]/g;
  const matches = [];
  let match;

  while ((match = regex.exec(inputString))) {
    matches.push(match[1]);
  }

  return matches;
}
function extractTextInQuotes(inputString) {
  const regex = /\`(.*?)\`/g;
  const matches = [];
  let match;

  while ((match = regex.exec(inputString))) {
    matches.push(match[1]);
  }
  return matches;
}
function extractTextInBold(inputString) {
  const regex = /\*\*(.*?)\*\*/g;
  const matches = [];
  let match;

  while ((match = regex.exec(inputString))) {
    matches.push(match[1]);
  }
  return matches;
}
function extractTextInItalics(inputString) {
  const regex = /\_\_(.*?)\_\_/g;
  const matches = [];
  let match;

  while ((match = regex.exec(inputString))) {
    matches.push(match[1]);
  }
  return matches;
}
function extractLinks(inputString) {
  const regex = /\[(.*?)\]\((.*?)\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(inputString))) {
    const valueA = match[1];
    const valueB = match[2];
    matches.push({ link: valueA, url: valueB });
  }

  return matches;
}
const handleLinks = (string) => {
  let links = extractLinks(string)
  let childrens = []
  let remains = string
  links.forEach((item) => {
    let stringParts = remains.split(`[${item.link}](${item.url})`)
    childrens = [...childrens, stringParts[0], { 'a': { children: item.link, href: item.url } }]
    remains = stringParts[1]
  })
  childrens = [...childrens, remains]
  return childrens

}
const parseString = (string, currentLevel, nested = false) => {
  let trimmed = string.trim()
  if (string[0] === '#') {
    let header = startsString(string, "#")
    if (header) {
      string = string.replaceAll('#', "")
      currentLevel[`h${header}`] = parseString(string, currentLevel, true)
    }

  } else if (extractTextInBold(string).length) {
    let child = []
    let quoted = extractTextInBold(string)
    let parts = string.split('**')
    parts.forEach(item => {
      if (quoted.some(text => text == item)) {
        child = [...child, { 'b': parseString(item, currentLevel, true) }]
      } else {
        child = [...child, { 'span': parseString(item, currentLevel, true) }]
      }
    })
    if (nested)
      return child
    else
      currentLevel['div'] = child
  } else if (extractTextInItalics(string).length) {
    let child = []
    let quoted = extractTextInItalics(string)
    let parts = string.split("__")
    parts.forEach(item => {
      if (quoted.some(text => text == item)) {
        child = [...child, { 'i': parseString(item, currentLevel, true) }]
      } else {
        child = [...child, { 'span': parseString(item, currentLevel, true) }]
      }
    })
    if (nested)
      return child
    else
      currentLevel['div'] = child
  } else if (trimmed[0] == "*" || trimmed[0] == '-') {
    string = string.trim()
    string = string.replace(trimmed[0], "")
    currentLevel['li'] = parseString(string, currentLevel, true)
  } else if (extractTextInSBrackets(string).length) {
    let child = handleLinks(string)
    if (nested)
      return child
    else
      currentLevel['div'] = child
  } else if (extractTextInQuotes(string).length) {
    let child = []
    let quoted = extractTextInQuotes(string)
    let parts = string.split('`')
    parts.forEach(item => {
      if (quoted.some(text => text == item)) {
        child = [...child, { 'code': item }]
      } else {
        child = [...child, { 'span': item }]
      }
    })
    if (nested)
      return child
    else
      currentLevel['div'] = child
  } else {
    if (nested)
      return string
    currentLevel['div'] = string
  }

}
const renderNode = (node, index) => {
  if (Array.isArray(node)) {
    let elements = node.map(item => renderNode(item))
    return React.createElement('ul', {}, elements)
  } else if (typeof node === 'string') {
    return node
  } else {
    let element = Object.keys(node)[0]
    if (element) {
      if (node[element] && Array.isArray(node[element])) {
        let children = node[element].map((item, index) => renderNode(item, index))
        return React.createElement(element, { key: index }, children)
      } else {
        if (element === 'a') {
          return React.createElement(element, { 'href': node[element].href }, node[element].children)
        }
        if (element === 'br') {
          return React.createElement(element)
        }
        return React.createElement(element, { key: index }, renderNode(node[element]))
      }
    }

    else
      return <></>
  }
}
const removeStartingChar = (node) => {
  let firstItem = {}
  if (Array.isArray(node)) {
    removeStartingChar(firstItem[0])
  } else if (typeof node === 'string') {
    node = node.split("").splice(1).join("")
  } else {
    if (!node || !Object.keys(node))
      return
    let firstKey = Object.keys(node)[0]
    removeStartingChar(node[firstKey])
  }
}
const generateNodes = (lines) => {
  let nodes = []
  let list = []
  let blockedItems = []
  let listIndex = 0
  let blocked = false
  let codeBlock = false
  let codes = []
  let code = ""
  lines.forEach((line, index) => {
    let node = {}
    let trimmed = line.trim()
    if (trimmed[0] === '>' && !blocked) {
      blocked = true
      trimmed = trimmed.split("").splice(1).join("")
    }
    if (codeBlock) {
      if (trimmed.includes("```")) {
        code = trimmed.split("```")[0]
        trimmed = trimmed.split("```")[1]
      }
    }

    if (!codeBlock && startsString(trimmed, "`") === 3) {
      codeBlock = 1
      code = trimmed.split("```")[1]
      trimmed = trimmed.split("```")[0]
    }

    parseString(trimmed, node)
    if (codeBlock) {
      console.log(line)
      if (codeBlock === 1) {
        nodes = [...nodes, node]
        codes = [...codes, code.replace("```","")]
        codeBlock = 2
      } else if (line.trim().includes('```')) {
        console.log("code blcok ended")
        codes = [...codes, code]
        nodes = [...nodes, {'pre':codes.join("\n") }, node]
        codes = []
        code = ""
        codeBlock = false
      } else {
        console.log("code blcok continueing")
        codes = [...codes, trimmed]
      }
    } else if (node['li']) {
      if (!listIndex) {
        listIndex = listIndex + 1
        list[listIndex] = [node]
      } else {
        list[listIndex] = [...list[listIndex], node]
      }
      if (lines[index + 1][0] !== '*' && lines[index + 1][0] !== '-') {
        nodes = [...nodes, list[listIndex]]
        listIndex = listIndex - 1
      }
    } else if (blocked) {
      blockedItems = [...blockedItems, node]
      if (trimmed.includes("..")) {
        nodes = [...nodes, { 'blockquote': blockedItems }]
        blockedItems = []
        blocked = false
      }
    } else {
      nodes = [...nodes, node]
    }
  });
  return nodes
}
export const parseMD = (content) => {
  let lines = breakLines(content)
  let nodes = generateNodes(lines)
  return nodes.map(node => renderNode(node))
}