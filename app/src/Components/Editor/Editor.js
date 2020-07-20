import axios from 'axios';
import React, {Component} from 'react';
import DOMHelper from "../../helpers/dom-helper";
import '../../helpers/iframeLoader.js';
import EditorText from "../editor-text/EditorText";
import UIKit from "uikit"
import ConfirmModal from "../confirm-modal/confirm-modal";
import ChooseModal from "../choose-modal/choose-modal";
import  Spinner from '../spinner/spinner';

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = 'main.html';
        this.state = {
            pageList: [],
            newPageName: "",
            loading: true
        }
        this.createNewPage = this.createNewPage.bind(this);
        this.isLoading =this.isLoading.bind(this);
        this.isLoaded =this.isLoaded.bind(this);
        this.save =this.save.bind(this);
        this.init =this.init.bind(this);
    }

    componentDidMount() {
       this.init(null, this.currentPage)
    }

    init(e, page) {
        if (e) {
            e.preventDefault();
        }
        this.isLoading();
        this.iframe = document.querySelector('iframe');
        this.open(page, this.isLoaded);
        this.loadPageList();
    }
    open(page, cb) {
        this.currentPage = page;

        axios.get(`../${page}?rnd=${Math.random()}`)
            .then(res => DOMHelper.parseStringToDom(res.data))
            .then(DOMHelper.wrapTextNodes)//функция враптекстнодес выполняется с данными полученными в предыдущем then
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelper.serializeDOMToString)
            .then(html => axios.post('./api/saveTempPage.php', {html}))
            .then(()=> this. iframe.load('../jdfv76xdfv7.html'))
            .then(() => axios.post("./api/deleteTempPage.php"))
            .then(() => this.enableEditing())
            .then(() => this.injectStyles())
            .then(cb)

    }
    save(onSuccess, onError) {
        this.isLoading();
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        axios.post("./api/savePage.php", {pageName: this.currentPage, html})
            .then(onSuccess)
            .catch(onError)
            .finally(this.isLoaded);
    }
    enableEditing() {
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
            const id = element.getAttribute('nodeid');
            const virtualElement = this.virtualDom.body.querySelector(`[nodeid = "${id}"]`)

            new EditorText(element, virtualElement);
        })
    }

    injectStyles() {
        const style = this.iframe.contentDocument.createElement('style');
        style.innerHTML = `
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
            text-editor:focus {
                outline: 3px solid red;
                outline-offset: 8px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(style)
    }



    loadPageList() {
        axios.get('./api/pageList.php')
            .then(res => {
                this.setState({pageList: res.data})

            })
    }
    createNewPage() {
        axios.post('./api/createNewPage.php', {"name": this.state.newPageName})
            .then(res => this.loadPageList())
            .catch(() => alert('Page Already Exists'))
    }
    deletePage(page) {
        axios.post('./api/deleteTempPage.php', {'name': page})
            .then(res => this.loadPageList())
            .catch(() => alert('Page doesnt exist'))
    }
    isLoading() {
        this.setState({
            loading: true
        })
    }
    isLoaded() {
        this.setState({
            loading: false
        })
    }

    render() {
        const {loading, pageList} = this.state;
        const modal = true;
        let spinner;
        loading ? spinner = <Spinner active /> : spinner = <Spinner />

        return (
                <>
                    <iframe src={this.currentPage} frameBorder = "1"></iframe>
                    {spinner}
                    <div className = "panel">
                        <button className="uk-button uk-button-primary uk-margin-small uk-margin-small-top uk-margin-small-right " uk-toggle="target: #modal-open">Open</button>
                        <button className="uk-button uk-button-primary uk-margin-small uk-margin-small-top uk-margin-small-right" uk-toggle="target: #modal-save">Publish</button>
                    </div>
                    <ConfirmModal modal ={modal} target={'modal-save'} method = {this.save} />
                    <ChooseModal modal = {modal} target = {'modal-open'} data = {pageList} redirect = {this.init}/>

                </>

        )
    }
}
