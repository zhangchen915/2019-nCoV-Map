import {h, Component} from 'preact';
import RSSParser from "rss-parser";
import './news.scss'

export default class News extends Component {
    constructor() {
        super();
        this.state = {
            news: []
        };

        let parser = new RSSParser();
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
        parser.parseURL(CORS_PROXY + 'https://rsshub.app/telegram/channel/nCoV2019', (err, feed)=> {
            if (err) throw err;
            this.setState({
                news: feed.items
            });
        })
    }

    render(props, state) {
        return (<div className='newsContent'>

            <div className='newsList'>
                {state.news.map((info, i) => <div key={i} className='newsItem' >
                    <div className='content' dangerouslySetInnerHTML={{__html:info.content}}/>
                    <div className='pubDate'>{info.pubDate}</div>
                </div>)}
            </div>

            <div>数据来源：<a href="https://t.me/s/nCoV2019">2019-nCoV疫情实时播报🅥</a></div>
        </div>);
    }
}
