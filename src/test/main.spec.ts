import { getHeadContent, getTailContent } from "../helper";

describe("getHeadContent", () => {
  it("selection 시작과 value의 시작이 같음, selection안에 유효하지 않은 마크다운 없음", () => {
    // given
    const value = `abcd\n\n ![image1](src/test/image1.png) abcd\n\n`;

    // when - abcd\n\n ![image1](src/test/image1.png)
    const selectionStart = 0;
    const startImageLinkIndex = 7;

    // then
    expect(getHeadContent(value, selectionStart, startImageLinkIndex)).toEqual(`abcd\n\n `);
  });

  it("selection 시작과 value의 시작이 다름, 유효하지 않은 마크다운 없음", () => {
    // given
    const value = `abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n`;

    // when - abcd\n\n ![image1](src/test/image1.png)\n![image2](src/te
    const selectionStart = 2;
    const startImageLinkIndex = 5;

    // then
    expect(getHeadContent(value, selectionStart, startImageLinkIndex)).toEqual(`abcd\n\n `);
  });

  it("selection 시작과 value의 시작이 다름, 유효하지 않은 마크다운 있음", () => {
    // given
    const value = `abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n`;

    // when - test/image1.png)\n![image2](src/test/image2.png)
    const selectionStart = 21;
    const startImageLinkIndex = 17;

    // then
    expect(getHeadContent(value, selectionStart, startImageLinkIndex)).toEqual(
      `abcd\n\n ![image1](src/test/image1.png)\n`
    );
  });
});

describe("getTailContent", () => {
  describe("selection 끝과 value의 끝이 다름", () => {
    it("selection 시작과 value의 시작이 같음, selection에는 유효한 마크다운 링크만 있음", () => {
      // given
      const value = `abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n`;

      // when - abcd\n\n ![image1](src/test/image1.png)
      const selectionStart = 0;
      const selectionEnd = 36;
      const endImageLinkIndex = 36;

      // then
      expect(getTailContent(value, selectionStart, selectionEnd, endImageLinkIndex)).toEqual(
        `\n![image2](src/test/image2.png)\n abcd\n\n`
      );
    });

    it("selection 시작과 value의 시작이 같음, selection에는 유효하지 않은 마크다운 링크 있음", () => {
      // given
      const value = `abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n`;

      // when - abcd\n\n ![image1](src/test/image1.png)\n![image2](src/te 가 블럭 상태
      const selectionStart = 0;
      const selectionEnd = 53;
      const endImageLinkIndex = 36;

      // then
      expect(getTailContent(value, selectionStart, selectionEnd, endImageLinkIndex)).toEqual(
        `\n![image2](src/test/image2.png)\n abcd\n\n`
      );
    });

    it("selection 시작과 value의 시작이 다름, selection에는 유효한 마크다운 링크만 있음", () => {
      // given
      const value = `abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n`;

      // when - ![image1](src/test/image1.png)\n![image2](src/test/image2.png) 가 블럭 상태
      const selectionStart = 7;
      const selectionEnd = 67;
      const endImageLinkIndex = 60;

      // then
      expect(getTailContent(value, selectionStart, selectionEnd, endImageLinkIndex)).toEqual(
        `\n abcd\n\n`
      );
    });

    it("selection 시작과 value의 시작이 다름, selection에는 유효하지 않은 마크다운 링크 있음", () => {
      // given
      const value = `abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n`;

      // when - cd\n\n ![image1](src/test/image1.png)\n![image2](src/test 가 블럭 상태
      const selectionStart = 2;
      const selectionEnd = 55;
      const endImageLinkIndex = 34;

      // then
      expect(getTailContent(value, selectionStart, selectionEnd, endImageLinkIndex)).toEqual(
        `\n![image2](src/test/image2.png)\n abcd\n\n`
      );
    });
  });

  describe("selection 끝과 value의 끝이 같음", () => {
    it("selection 시작과 value의 시작이 같음, selection에는 유효하지 않은 마크다운 링크 없음", () => {
      // given
      const value = `abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n`;

      // when - abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n 가 블럭 상태
      const selectionStart = 0;
      const selectionEnd = 75;
      const endImageLinkIndex = 67;

      // then
      expect(getTailContent(value, selectionStart, selectionEnd, endImageLinkIndex)).toEqual(
        `\n abcd\n\n`
      );
    });

    it("selection 시작과 value의 시작이 다름, selection에는 유효한 마크다운 링크만 있음", () => {
      // given
      const value = `abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n`;

      // when - cd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n 가 블럭 상태
      const selectionStart = 2;
      const selectionEnd = 75;
      const endImageLinkIndex = 65;

      // then
      expect(getTailContent(value, selectionStart, selectionEnd, endImageLinkIndex)).toEqual(
        `\n abcd\n\n`
      );
    });

    it("selection 시작과 value의 시작이 다름, selection에는 유효하지 않은 마크다운 링크 있음", () => {
      // given
      const value = `abcd\n\n ![image1](src/test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n`;

      // when - test/image1.png)\n![image2](src/test/image2.png)\n abcd\n\n 가 블럭 상태
      const selectionStart = 21;
      const selectionEnd = 75;
      const endImageLinkIndex = 46;

      // then
      expect(getTailContent(value, selectionStart, selectionEnd, endImageLinkIndex)).toEqual(
        `\n abcd\n\n`
      );
    });
  });
});
