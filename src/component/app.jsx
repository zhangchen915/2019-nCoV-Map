import {h, Component} from 'preact';
import {renderLiner} from "./totalCases";
import {renderLayer} from "./renderLayer";
import News from "./news";

import './app.scss'

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            mainInfo: ''
        };

        fetch('//api.tianapi.com/txapi/ncov/index?key=ad031245a5518179cd62d16e5c18eea0')
            .then(res => res.json())
            .then(data => this.setState({
                    mainInfo: data.newslist[0].desc
                })
            );
    }

    componentDidMount() {
        renderLiner();
        renderLayer()
    }

    async search(word, offset) {
        if (!word) {
            this.setState({word: '', definition: ''});
            return;
        }

        if (!offset) {
            const list = await this.state.lookup.getWordList(word.trim());
            if (word === list[0]) offset = list[0].offset
        }

        if (offset) this.setState({
            word: word,
            definition: await this.state.lookup.getDefinition(offset)
        });

        return offset;
    }

    render(props, state) {
        return (<div>
            <div className="top">

                {
                    state.mainInfo ? <section>
                        <h2>确诊 {state.mainInfo.confirmedCount}</h2>
                        <h2>疑似 {state.mainInfo.suspectedCount}</h2>
                        <h2>治愈 {state.mainInfo.curedCount}</h2>
                        <h2>死亡 {state.mainInfo.deadCount}</h2>
                        <div>更新时间：{new Date(state.mainInfo.modifyTime).toLocaleString()}</div>
                    </section> : ''
                }
                <div id="c1">
                    <div className="tip">⚠︎ 注意：接口不同数据可能存在滞后</div>
                </div>
            </div>
            <div id="map"/>

            <News/>
        </div>);
    }
}
