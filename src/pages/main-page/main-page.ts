import Page from '../../components/templates/page';
import './main-page.scss'
import humans_picture from '../../assets/humans_background.png'
import book from '../../assets/text_book.png'
import games from '../../assets/games.png'
import statistics from '../../assets/statistics.png'
import free from '../../assets/free.png'
import danya from '../../assets/developer_danya.jpg'
import andrey from '../../assets/developer_andrey.jpg'
import azizbek from '../../assets/developer_azizbek.jpg'

export default class MainPage extends Page {
  static TextObject = {
    MainTitle: 'Main Page',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const main_page_wrapper = this.createDivBlock('main_page_wrapper');

    const description_wrapper = this.createDivBlock("description_wrapper");
    description_wrapper.innerHTML = `
    <div class="description">
            <h2 class="description_logo">RSLang</h2>
            <p class="description_title">Learn English at any place you wish</p>
            <p class="description_desc">RSLang app helps you to learn English faster. Begin learning right now and very soon you will see result! </p>
            <a href="#learning-page" class="description_button">Get Started</a>
    </div>
    <img src="${humans_picture}" alt="">
    `

    const benefits_section = this.createDivBlock("benefits_wrapper");
    benefits_section.innerHTML = `
    <div class="benefits">
        <h2 class="section_title">What do we offer?</h2>
        <div class="benefits_enum">
            <div class="benefit">
                <img src="${book}" alt="" class="benefit_icon">
                <h3 class="benefit_title">Textbook</h3>
                <p class="benefit_description">The electronic textbook with six sections. Each section has 30 pages of 20 words. In total – 4000 of most common English words. Each word has the translation, thematic image, pronunciation of the word (separately and in a sentence)</p>
            </div>
            <div class="benefit">
                <img src="${games}" alt="" class="benefit_icon">
                <h3 class="benefit_title">Games</h3>
                <p class="benefit_description">Traditional learning is boring. So we offer better way to memorize words - by playing games “audiocall” and “sprint”. Play wherever you want: at home, in a bus, on a go etc. </p>
            </div>
            <div class="benefit">
                <img src="${statistics}" alt="" class="benefit_icon">
                <h3 class="benefit_title">Statistics</h3>
                <p class="benefit_description">All the progress of training can be viewed in statistics section. We do not collect any personal data, just that which will be useful for you learning.</p>
            </div>
            <div class="benefit">
                <img src="${free}" alt="" class="benefit_icon">
                <h3 class="benefit_title">All for free</h3>
                <p class="benefit_description">An access to the RSLang app is completely free. We charge our users nothing because we feel our mission to make learning new languages easier and more accessible</p>
            </div>
        </div>
    </div>
    `

    const video_section = this.createDivBlock("video");
    video_section.innerHTML = `
      <h2 class="section_title">How does it work?</h2>
      <iframe <iframe width="560" height="315" src="https://www.youtube.com/embed/yK0P1Bk8Cx4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `

    const developer_section = this.createDivBlock("developers");
    developer_section.innerHTML = `
    <h2 class="section_title">Our team</h2>
    <div class="developers_wrapper">
    <div class="developer">
        <img src="${danya}" alt="" class="developer_image">
        <div class="developer_text">
            <h3 class="developer_name">Danya</h3>
            <div class="developer_role">
                <div id="team-lead">Team lead</div>
                <div id="front-end">Front-end</div>
                <div id="design">Design</div>
            </div>
            <p class="developer_short_desc">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis,
                repudiandae saepe atque, animi illo amet error numquam aspernatur maxime nihil, itaque labore libero
                voluptatibus magnam quis delectus quaerat non culpa.</p>
        </div>
    </div>
    <div class="developer">
        <img src="${andrey}" alt="" class="developer_image">
        <div class="developer_text">
            <h3 class="developer_name">Andrey</h3>
            <div class="developer_role">
                <div id="front-end">Front-end</div>
                <div id="back-end">Back-end</div>
                <div id="design">Design</div>
            </div>
            <p class="developer_short_desc">Developed textbook page, hard words page, registration and login form
            , authorisation, graph for new words, loading animation, basic design for main page, nav menu and words </p>
        </div>
    </div>
    <div class="developer">
        <img src="${azizbek}" alt="" class="developer_image">
        <div class="developer_text">
            <h3 class="developer_name">Azizbek</h3>
            <div class="developer_role">
                <div id="front-end">Front-end</div>
                <div id="design">Design</div>
            </div>
            <p class="developer_short_desc">Basically, I worked with development of a game called "Audio Call":
            I made the initial screen of the game, added an automatic player for the pronunciation of words,
            created final screen of the game to display the results of the game and save the user's progress. In addition,
            I worked on the error page and worked on the design of various parts of our project.</p>
        </div>
    </div>
</div>
    `
    main_page_wrapper.append(description_wrapper);
    main_page_wrapper.append(benefits_section);
    main_page_wrapper.append(video_section);
    main_page_wrapper.append(developer_section);
    this.container.append(main_page_wrapper);
    return this.container;
  }
}
