const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
// need to change before import application (important)
test.mock.method(fs,"readFile",(path,encode,callback)=>{
    callback(null, "a\nb\nc");
});
const { Application, MailSystem } = require('./main');

// TODO: write your tests here
// Remember to use Stub, Mock, and Spy when necessary

test('MailSystem.write method', (t) => {
    const mail = new MailSystem();

    const mockWrite = t.mock.fn(mail.write);

    assert.strictEqual(mockWrite('name'), "Congrats, name!");
    assert.strictEqual(mockWrite.mock.calls.length, 1);
    assert.strictEqual(mockWrite.mock.calls[0].arguments[0], 'name'); 

    const mockLog = t.mock.fn(console.log);
    console.log = mockLog;

    mail.write('name');

    assert.strictEqual(mockLog.mock.calls.length, 1);
    assert.strictEqual(mockLog.mock.calls[0].arguments[0], '--write mail for name--');
});
test('MailSystem.send method', (t) => {
    const mail = new MailSystem();

    Math.random = t.mock.fn(() => 0.9);

    assert.strictEqual(mail.send('name'), true);

    Math.random = t.mock.fn(() => 0.1);

    assert.strictEqual(mail.send('name'), false);

    const mockLog = t.mock.fn(console.log);
    console.log = mockLog;

    mail.send('name');
    assert.strictEqual(mockLog.mock.calls.length, 2);
    assert.strictEqual(mockLog.mock.calls[0].arguments[0], '--send mail to name--');
});


test('test getNames method', async (t) => {
    const app = new Application();

    const [people, selected] = await app.getNames();
    assert.deepStrictEqual(people, ['a', 'b', 'c']);
    assert.deepStrictEqual(selected, []);


});
test('test getRandomPerson method', (t) => {
    const app = new Application();
    app.people = ['a', 'b', 'c'];
    const person = app.getRandomPerson();
    assert.ok(['a', 'b', 'c'].includes(person));
    Math.random = t.mock.fn(() => 0.1);
    assert.strictEqual(app.getRandomPerson(), 'a');
    Math.random = t.mock.fn(() => 0.6);
    assert.strictEqual(app.getRandomPerson(), 'b');
    Math.random =  t.mock.fn(() => 0.9);
    assert.strictEqual(app.getRandomPerson(), 'c');
    app.people = [];
    assert.strictEqual(app.getRandomPerson(), undefined);
});
const tmp =Math.random;
test('test selectNextPerson method',(t)=>{
    const app = new Application();
    app.people = ['a', 'b', 'c'];
    app.selected = [];
    Math.random = t.mock.fn(() => 0.9);
    assert.strictEqual(app.selectNextPerson(), 'c');
    t.mock.method(Math, "random", () => {    
        Math.random = tmp;
        return 0.9
    });
    // add someone not c
    assert.notEqual(app.selectNextPerson(), "c");
    // add last one
    app.selectNextPerson();
    // full
    assert.strictEqual(app.selectNextPerson(), null);
    
});

test('test notifySelected method',(t)=>{
    const app = new Application();
    app.selected = ['c'];
    Math.random = t.mock.fn(() => 0.6);
    assert.strictEqual(app.notifySelected() , undefined);
    Math.random = t.mock.fn(() => 0.1);
    assert.strictEqual(app.notifySelected() , undefined);
    const mocklog = t.mock.fn(console.log);
    console.log = mocklog;
    assert.strictEqual(mocklog.mock.calls.length, 0);
    app.notifySelected();
    assert.strictEqual(mocklog.mock.calls.length, 4);
});
