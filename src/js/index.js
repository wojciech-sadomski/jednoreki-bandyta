import "../scss/main.scss";

// uncomment the lines below to enable PWA
// import {registerSW} from './pwa.js';
// registerSW();

/* place your code below */
class Result {
  //metoda statyczna jest tylko z poziomu odwołania klasy
  static moneyWinInGame(resault, bid) {
    if (resault) return bid * 3;
    else return 0;
  }
  static checkWinner(draw) {
    if (
      (draw[0] === draw[1] && draw[1] === draw[2]) ||
      (draw[0] !== draw[1] && draw[1] !== draw[2] && draw[0] !== draw[2])
    )
      return true;
    else return false;
  }
}
Result.moneyWinInGame(true, 12);

class Draw {
  constructor() {
    this.options = ["red", "green", "blue"];
    let _result = this.drawResult();
    this.getDrawResult = () => _result;
  }

  drawResult() {
    let colours = [];
    for (let i = 0; i < this.options.length; i++) {
      const index = Math.floor(Math.random() * this.options.length);
      const colour = this.options[index];
      colours.push(colour);
    }

    return colours;
  }
}
class Wallet {
  constructor(money) {
    let _money = money; //podkreślnik przed nazwą ukrywa tą zmienną
    this.getWalletValue = () => _money;

    //sprawdzenie czy użytkownik ma wystarczającą ilość środków
    this.checkCanPlay = (value) => {
      if (_money >= value) return true;
      return false;
    };
    this.changeWallet = (value, type = "+") => {
      if (typeof value === "number" && typeof !isNaN(value)) {
        if (type === "+") {
          return (_money += value);
        } else if (type === "-") {
          return (_money -= value);
        } else {
          throw new Error("Nieprawidłowy typ działania");
        }
      } else {
        console.log(typeof value);
        throw new Error("Nieprawidłowa liczba");
      }
    };
  }
}
class Statistic {
  constructor() {
    this.gameResult = [];
  }
  addGametoStatistics(win, bid) {
    let gameResult = {
      win: win,
      bid: bid,
    };
    this.gameResult.push(gameResult);
  }
  showGameStatistisc() {
    let games = this.gameResult.length;
    let wins = this.gameResult.filter((result) => result.win).length;
    let losses = this.gameResult.filter((result) => !result.win).length;

    return [games, wins, losses];
  }
}

const stats = new Statistic();
class Game {
  constructor(start) {
    this.stats = new Statistic();
    this.wallet = new Wallet(start);
    document
      .getElementById("start")
      .addEventListener("click", this.startGame.bind(this));
    this.spanWallet = document.querySelector(".panel span.wallet");
    this.boards = [...document.querySelectorAll("div.color")];
    this.inputBid = document.getElementById("bid");
    this.spanResault = document.querySelector(".score span.result");
    this.spanGames = document.querySelector(".score span.number");
    this.spanWin = document.querySelector(".score span.win");
    this.spanLoss = document.querySelector(".score span.loss");
    this.render();
  }

  render(
    colors = ["grey", "grey", "grey"],
    money = this.wallet.getWalletValue(),
    result = "",
    stats = [0, 0, 0],
    bid = 0,
    wonMoney = 0
  ) {
    this.boards.forEach((board, i) => {
      board.style.backgroundColor = colors[i];
    });

    this.spanWallet.textContent = money;
    if (result) {
      result = `Wygrałeś ${wonMoney}$`;
    } else if (!result && result !== "") {
      result = `Przegrałeś ${bid}$`;
    }
    this.spanResault.textContent = result;
    this.spanGames.textContent = stats[0];
    this.spanWin.textContent = stats[1];
    this.spanLoss.textContent = stats[2];
    this.inputBid.value = "";
  }

  startGame() {
    if (this.inputBid.value < 1)
      return alert("Kwota która chcesz grać jest za mała lub niewłaściwa");
    const bid = Math.floor(this.inputBid.value);
    if (!this.wallet.checkCanPlay(bid)) {
      return alert("Masz za mało środków albo coś źle wpisujesz.");
    }
    this.wallet.changeWallet(bid, "-");

    this.draw = new Draw();
    const colors = this.draw.getDrawResult();
    const win = Result.checkWinner(colors);
    const wonMoney = Result.moneyWinInGame(win, bid);
    this.wallet.changeWallet(wonMoney);
    this.stats.addGametoStatistics(win, bid);

    this.render(
      colors,
      this.wallet.getWalletValue(),
      win,
      this.stats.showGameStatistisc(),
      bid,
      wonMoney
    );
  }
}

const game = new Game(300);
console.log("HELLO 🚀");
