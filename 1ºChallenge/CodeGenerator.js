
var display = document.getElementById("display");

rethink.default.install({
    domain: 'hysmart.rethink.ptinovacao.pt',
    development: true,
    runtimeURL: 'hyperty-catalogue://catalogue.hysmart.rethink.ptinovacao.pt/.well-known/runtime/Runtime'
}).then((runtime) => {
    console.log("inside runtime");
    const hypertyURI = (hyperty_domain, hyperty) =>
        'hyperty-catalogue://catalogue.'+hyperty_domain+'/.well-known/hyperty/'+hyperty;

    runtime.requireHyperty(hypertyURI('hysmart.rethink.ptinovacao.pt','CodeGeneratorReporter'))
        .then((CodeGeneratorReporter) => {
            console.log("inside CodeGeneratorReporter");
            const team_name = "C_For_Life";
            setTimeout( () => {
                CodeGeneratorReporter.instance.generateCode(team_name).then((code) => {
                    console.log("code: " + code);
                    display.innerHTML = code;
                });
            },1000);
    });
});