class TestClass {
    constructor(name) {
        this.name = name;
    }

    toConfig() {
        return {
            name: this.name
        };
    }
}

module.exports = TestClass;