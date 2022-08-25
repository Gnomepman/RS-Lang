import Component from '../templates/component';
import './times.scss'

export default class Timer extends Component{
    protected time: number;
    constructor(tagName: string, className: string, time: number) {
        super(tagName, className);
        this.time = time;
    }

    startTimer(){
        let countdown = this.time * 1000;
        this.container.textContent = String(countdown / 1000);
        const temp = () => {
            countdown -= 1000;
            console.log(countdown);
            this.container.textContent = String(countdown / 1000);
            if (countdown === 0){ clearInterval(Timer) }
        }
        const Timer = setInterval(temp,1000);
        
    }

    render() {
        this.container.innerHTML = String(this.time);
        this.startTimer();
        return this.container;
    }
}