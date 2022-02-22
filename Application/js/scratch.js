/*


nero_controller(sensors){
    let vr = Math.tanh(sensors[0] * this.nn_parametres[0] + this.nn_parametres[2] * sensors[1]);
    let vl = Math.tanh(sensors[1] * this.nn_parametres[0] + this.nn_parametres[3] * sensors[1]);
    return [vl,vr];
}

//Neuronr controller parametres
this.nn_parametres = [1, 0, 0, 1];


set_nn_parameter(par) {

    this.nn_parametres = par;

}

reset(){

    this.x = Math.random() * app.renderer.width;
    this.y =		Math.random() * app.renderer.height,;
    this.rotation = Math.random() * Math.PI*2 );
this.updateTransform();

}


<div class="row">
    <div class="col p-0" id="carte"></div>
    <div class="col p-0">

        <!-- contrôleur -->
        <div class="controleur">
            <!-- buttons -->
            <div class="bg-primary buttons text-center">
                <a>
                    <i id="start" class="bi bi-play-circle"></i>
                </a>
                <a onclick="pauseAction()">
                    <i id="stop" class="bi bi-pause-circle"></i>
                </a>
                <a onclick="restartAction()">
                    <i class="bi bi-arrow-counterclockwise"></i>
                </a>
                <a onclick="saveAction()">
                    <i class="bi bi-save2"></i>
                </a>
            </div>
            <!-- neurone -->
            <!--<div id="myDiagramDiv"></div>-->

            <!-- champ de vision -->
            <div class="vision">
                <p>
                    <input type="checkbox" id="cbox1" value="first_checkbox">
                        <label for="cbox1">proche</label>
                </p>
                <p>
                    <input type="checkbox" id="cbox2" value="second_checkbox">
                        <label for="cbox2">moyen</label>
                </p>
                <p>
                    <input type="checkbox" id="cbox3" value="third_checkbox">
                        <label for="cbox3">loin</label>
                </p>
            </div>

        </div>
    </div>
</div>

 */