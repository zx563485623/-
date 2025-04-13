document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');

    // 文档列表（带编号的文件名）
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

    // 搜索函数
    async function searchFiles(searchTerm) {
        resultsContainer.innerHTML = '<p>正在搜索...</p>';

        if (!searchTerm.trim()) {
            resultsContainer.innerHTML = '<p class="no-results">请输入搜索词</p>';
            return;
        }

        const matchedFiles = [];

        // 遍历所有txt文件
        for (const file of txtFiles) {
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    console.warn(`文件 ${file} 加载失败`);
                    continue;
                }

                const text = await response.text();
                if (text.includes(searchTerm)) {
                    // 只存储文件名（去掉路径和.txt后缀）
                    const fileName = file.split('/').pop().replace('.txt', '');
                    matchedFiles.push(fileName);
                }
            } catch (error) {
                console.error(`读取文件 ${file} 出错:`, error);
                // 这里添加了错误处理的闭合括号
            } // <-- 确保这里有闭合的catch块
        }

        displayResults(matchedFiles, searchTerm);
    }

    // 显示结果（每个文件名单独一行）
    function displayResults(matchedFiles, searchTerm) {
        resultsContainer.innerHTML = '';

        if (matchedFiles.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">没有找到包含 "' + searchTerm + '" 的文档</p>';
            return;
        }

        // 创建结果元素
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';

        // 显示搜索词
        const searchTermElement = document.createElement('h3');
        searchTermElement.textContent = `包含"${searchTerm}"的文档：`;
        resultElement.appendChild(searchTermElement);

        // 创建无序列表来显示文件名
        const filesListElement = document.createElement('ul');

        matchedFiles.forEach(fileName => {
            const listItem = document.createElement('li');
            listItem.textContent = fileName;
            filesListElement.appendChild(listItem);
        });

        resultElement.appendChild(filesListElement);
        resultsContainer.appendChild(resultElement);

        // 复制到剪贴板时用换行符分隔
        if (typeof copy === 'function') {
            copy(matchedFiles.join('\n'));
        } else {
            console.log('复制功能不可用，以下是结果：', matchedFiles.join('\n'));
        }
    }

    // 事件监听
    searchBtn.addEventListener('click', () => {
        searchFiles(searchInput.value.trim());
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchFiles(searchInput.value.trim());
        }
    });
});