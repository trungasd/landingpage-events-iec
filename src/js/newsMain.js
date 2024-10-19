fetch('http://localhost:3000/api/news')
.then(response => response.json())
.then(news => {
    const newsList = document.getElementById('news-list');

    news.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';

        newsItem.innerHTML = `
                        <figure class="news-item__thumb">
                            <a href="${news.link}" target="_blank">
                                <img
                                    src="${news.image}"
                                    alt=""
                                    class="news-item__img"
                                />
                            </a>
                        </figure>
                        <section class="news-item__body">
                            <h3>
                                <a href="${news.link}" target="_blank">
                                    ${news.title}
                                </a>
                            </h3>
                            <p class="news-item__desc">
                                ${news.content}
                            </p>
                            <a href="${news.link}" target="_blank">
                                Learn More
                            </a>
                        </section>
       
        `;

        newsList.appendChild(newsItem);
    });
})
.catch(error => console.error('Error fetching news:', error));