import Component from '../templates/component';
import './times.scss'
/*
Example:

Create timer
let timer = new Timer('div', 'timer', timeForGame).render(); 

Timer fires event when clock id down to 0
timer.addEventListener('countDown', () => { console.log("Timer is out") })
*/
export default class Timer extends Component{
    protected time: number;
    protected event: CustomEvent;
    constructor(tagName: string, className: string, time: number) {
        super(tagName, className);
        this.time = time;
        this.event = new CustomEvent("countDown")
    }

    startTimer(){
        let countdown = this.time * 1000;
        this.container.textContent = String(countdown / 1000);
        const countingDown = () => {
            // console.log(countdown / 1000, " seconds");
            countdown -= 1000;
            this.container.textContent = String(countdown / 1000);
            if (countdown === 0){ 
                this.container.dispatchEvent(this.event);
                clearInterval(Timer) 
            }
        }
        const Timer = setInterval(countingDown, 1000);
    }

    render() {
        this.container.innerHTML = String(this.time);
        this.startTimer();
        return this.container;
    }
}