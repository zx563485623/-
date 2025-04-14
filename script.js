// 定义要加载的文本文件
const txtFiles = [
    'txt-files/0_作轻.txt',
    'txt-files/1_占溺.txt',
    'txt-files/2_黑词.txt',
    'txt-files/3_话溺.txt',
    'txt-files/4_作溺.txt',
    'txt-files/5_作闲.txt',
    'txt-files/6_戈罪.txt',
    'txt-files/7_至闲.txt',
    'txt-files/8_话闹.txt',
    'txt-files/9_灰饰.txt',
    'txt-files/10_罪司.txt',
    'txt-files/11_埋寂.txt',
    'txt-files/12_颜文字.txt',
    'txt-files/13_远笛.txt'
];

// 存储所有文件内容的数组
let fileContents = [];

// 加载所有文本文件
async function loadAllFiles() {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) {
        console.error('结果容器元素未找到');
        return;
    }

    resultsContainer.innerHTML = '<div class="loading">正在加载文件...</div>';

    try {
        const promises = txtFiles.map(file => {
            return fetch(file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`无法加载文件: ${file}`);
                    }
                    return response.text();
                })
                .catch(error => {
                    console.error(error);
                    return `无法加载文件: ${file}`;
                });
        });

        fileContents = await Promise.all(promises);
        resultsContainer.innerHTML = '<div class="no-results">输入搜索词以查看结果</div>';
    } catch (error) {
        console.error('加载文件时出错:', error);
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="no-results">加载文件时出错，请检查控制台</div>';
        }
    }
}

// 搜索函数
function searchText(query) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) {
        console.error('结果容器元素未找到');
        return;
    }

    if (!query || !query.trim()) {
        resultsContainer.innerHTML = '<div class="no-results">输入搜索词以查看结果</div>';
        return;
    }

    const results = [];

    fileContents.forEach((content, index) => {
        if (!content || typeof content !== 'string') {
            return;
        }

        try {
            // 使用正则表达式查找包含查询词的所有完整词语
            const regex = new RegExp(`[^\\s]*${escapeRegExp(query)}[^\\s]*`, 'g');
            const matches = content.match(regex);

            if (matches && matches.length > 0) {
                // 去重
                const uniqueMatches = [...new Set(matches)];
                results.push({
                    filename: txtFiles[index].split('/').pop(),
                    matches: uniqueMatches
                });
            }
        } catch (e) {
            console.error(`处理文件 ${txtFiles[index]} 时出错:`, e);
        }
    });

    displayResults(results);
}

// 显示搜索结果
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) {
        console.error('结果容器元素未找到');
        return;
    }

    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">没有找到匹配的结果</div>';
        return;
    }

    let html = '';

    results.forEach(result => {
        if (!result || !result.filename || !result.matches) {
            return;
        }
        // 修改这里：去掉文件名中的.txt后缀
        const displayName = result.filename.replace('.txt', '');
        html += `
            <div class="result-item">
                <div class="filename">${escapeHtml(displayName)}</div>
                <div class="matches">
                    ${result.matches.map(match =>
            `<span class="match">${escapeHtml(match)}</span>`
        ).join('')}
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = html;
}

// 辅助函数：转义正则表达式特殊字符
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 辅助函数：转义HTML特殊字符
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 检查必要的元素是否存在
    if (!document.getElementById('search-input') || !document.getElementById('results')) {
        console.error('必要的DOM元素未找到');
        return;
    }

    loadAllFiles();

    const searchInput = document.getElementById('search-input');
    let searchTimeout = null;

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = searchInput.value.trim();
            searchText(query);
        }, 300);
    });

    // 清理定时器
    window.addEventListener('beforeunload', () => {
        clearTimeout(searchTimeout);
    });
});