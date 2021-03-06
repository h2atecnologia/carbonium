import * as assert from "assert";
import { $, CarboniumType } from "../src/carbonium";
// TODO: this should work - find out why not
// import { $, CarboniumType } from "../";
import "@webcomponents/webcomponentsjs/custom-elements-es5-adapter";

/**
 * Test framework used:
 * Mocha https://mochajs.org/
 * Assert https://nodejs.org/api/assert.html
 */

describe("$", () => {
  beforeEach(() => {
    document.body.textContent = "";
    for (let i = 0; i < 6; i++) {
      const div = document.createElement("div");
      div.textContent = `item${i}`;
      document.body.appendChild(div);
    }
  });

  it("textContent one element", () => {
    $("div:first-child").textContent = "hello";
    const divs = document.getElementsByTagName("div");
    assert.equal(divs[0].textContent, "hello");
  });

  it("textContent one element", () => {
    const div: CarboniumType = $("div:first-child");
    div.textContent = "hello";
    const divs = document.getElementsByTagName("div");
    assert.equal(divs[0].textContent, "hello");
  });

  it("textContent all elements", () => {
    $("div").textContent = "hello";
    assert.equal(document.body.textContent, "hellohellohellohellohellohello");
  });

  it("length", () => {
    assert.equal($("div").length, 6);
  });

  it("forEach", () => {
    const divs = $("div");
    divs.forEach((div, i) => {
      div.textContent = `div ${i}`;
    });
    assert.equal(divs[0].textContent, "div 0");
    assert.equal(divs[5].textContent, "div 5");
  });

  it("for of", () => {
    const divs = $("div");
    let i = 0;
    for (const div of divs) {
      div.textContent = `div ${i++}`;
    }
    assert.equal(divs[0].textContent, "div 0");
    assert.equal(divs[5].textContent, "div 5");
  });

  it("setAttribute all elements", () => {
    $("div").setAttribute("aria-label", "List item");
    const divs = document.getElementsByTagName("div");
    assert.equal(divs[0].getAttribute("aria-label"), "List item");
    assert.equal(divs[1].getAttribute("aria-label"), "List item");
    assert.equal(divs[5].getAttribute("aria-label"), "List item");
  });

  it("filter", () => {
    $("div").filter((el) => el.textContent == "item1").textContent = "hello";
    assert.equal(document.body.textContent, "item0helloitem2item3item4item5");
  });

  it("class add method", () => {
    $("div").classList.add("some-class");
    const divs = document.getElementsByTagName("div");
    assert.ok(divs[0].classList.contains("some-class"));
    assert.ok(divs[5].classList.contains("some-class"));
  });

  it("rel add and contains method", () => {
    const a = document.createElement("a");
    a.relList.add("some-class");
    assert.ok(a.relList.contains("some-class"));
  });

  it("class value property", () => {
    $("div").classList.add("some-class");
    const divs = document.getElementsByTagName("div");
    assert.equal(divs[0].classList.value, "some-class");
  });

  it("class add method and textContent property", () => {
    $("div:first-child").classList.add("some-class").textContent = "hello";
    const divs = document.getElementsByTagName("div");
    assert.ok(divs[0].classList.contains("some-class"));
    assert.ok(!divs[5].classList.contains("some-class"));
    assert.equal(divs[0].textContent, "hello");
    assert.equal(divs[5].textContent, "item5");
  });

  it("filter and class add method and textContent property", () => {
    $("div")
      .filter((el) => el.textContent == "item0")
      .classList.add("some-class").textContent = "hello";
    const divs = document.getElementsByTagName("div");
    assert.ok(divs[0].classList.contains("some-class"));
    assert.ok(!divs[5].classList.contains("some-class"));
    assert.equal(divs[0].textContent, "hello");
    assert.equal(divs[5].textContent, "item5");
  });

  it("filter and style setProperty method and textContent property", () => {
    $("div")
      .filter((el) => el.textContent == "item0")
      .style.setProperty("--leftmargin", "10px").textContent = "hello";
    const divs = document.getElementsByTagName("div");
    assert.equal(divs[0].style.getPropertyValue("--leftmargin"), "10px");
    assert.equal(divs[5].style.getPropertyValue("--leftmargin"), "");
    assert.equal(divs[0].textContent, "hello");
    assert.equal(divs[5].textContent, "item5");
  });

  it("combined", () => {
    $("div")
      .forEach((el) => (el.title = `A div with content ${el.textContent}`))
      .setAttribute("aria-label", "List item")
      .filter((el) => el.textContent == "item1").textContent = "hello";
    const divs = document.getElementsByTagName("div");
    assert.equal(divs[0].getAttribute("aria-label"), "List item");
    assert.equal(divs[5].getAttribute("aria-label"), "List item");
    assert.equal(divs[0].getAttribute("title"), "A div with content item0");
    assert.equal(divs[5].getAttribute("title"), "A div with content item5");
    assert.equal(document.body.textContent, "item0helloitem2item3item4item5");
  });

  it("textContent empty list", () => {
    assert.doesNotThrow(() => {
      $("div.non-existent").textContent = "hello";
    });
  });

  it("setAttribute empty list", () => {
    assert.doesNotThrow(() => {
      $("div.non-existent").setAttribute("aria-label", "List item");
    });
  });

  it("call element specific function", () => {
    const input = document.createElement("input");
    document.querySelector("div:first-child").appendChild(input);
    assert.doesNotThrow(() => {
      $<HTMLInputElement>("input").select();
    });
  });

  it("addEventListener", (done) => {
    $("div:first-child").addEventListener("click", () => {
      done();
    });
    $("div:first-child").click();
  });

  it("canvas", () => {
    const canvas = document.createElement("canvas");
    $("div:nth-child(1)").appendChild(canvas);
    const ctx = $<HTMLCanvasElement>("canvas").getContext("2d", {
      alpha: false,
    });
    ctx.fillRect(0, 0, 100, 100);
  });

  it("style set/get", () => {
    $("div:nth-child(1)").style.color = "red";
    assert.equal($("div:nth-child(1)").style.color, "red");
  });

  it("Parse HTML", () => {
    const div$ = $("<div class='a1'>b1</div>");
    assert.ok(div$.classList.contains("a1"));
    $("div:first-child").appendChild(div$[0]);
    assert.equal($(".a1").length, 1);
    assert.equal($(".a1").textContent, "b1");
  });

  it("Set", () => {
    const set = new Set(["1a", "2a", "3a"]);
    let result = "";
    set.forEach((item) => {
      result += `[${item}]`;
    });
    assert.equal(result, "[1a][2a][3a]");
  });
  it("Custom Element", () => {
    class GolInfo extends HTMLElement {
      connectedCallback() {
        $("nnn").addEventListener("click", () => {
          console.log("click");
        });
      }
    }
    customElements.define("gol-info", GolInfo);

    const i = document.createElement("gol-info");
    // const i = new GolInfo();
    document.body.appendChild(i);
  });
});
