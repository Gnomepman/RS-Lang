import './footer.scss'
import Component from '../templates/component';
import github from '../../assets/github.svg'
import rsschool from "../../assets/RS School.svg"

export default class Footer extends Component {
    constructor(tagName: string, className: string) {
        super(tagName, className);
    }

    render() {
        this.container.innerHTML = `
        <a href="https://rs.school/js/" target="_blank"><img src="${rsschool}" alt="" class="footer_logo"></a>
        <div class="footer_developers">
            <a href="https://github.com/Gnomepman" class="footer_developer" target="_blank">
                <img src="${github}" alt="" class="github_icon">Gnomepman
            </a>
            <a href="https://github.com/AndreyGudin" class="footer_developer" target="_blank">
                <img src="${github}" alt="" class="github_icon">AndreyGudin
            </a>
            <a href="https://github.com/Azizbek98" class="footer_developer" target="_blank">
                <img src="${github}" alt="" class="github_icon">Azizbek98
            </a>
        </div>
        <span class="year">2022</span>
        `
        return this.container;
      }
}