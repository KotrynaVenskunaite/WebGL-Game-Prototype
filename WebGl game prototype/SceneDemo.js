'use strict';

var DemoScene = function(gl) {
    this.gl = gl;
};

DemoScene.prototype.Load = function (cb){
    console.log('Loading demo scene');

    var me = this;

    async.parallel({
        Models: function (callback){
            async.map({
                'Bench_model': 'Models/bench.json',
                'Vinny_Bench': 'Models/Vinny_Bench.json',
                'Vinny_Point_Up': 'Models/Vinny_Point_Up_2.json',
                'Vinny_Crossed_Arms': 'Models/Vinny_Crossed_arms.json',
                'Vinny_Palm_Point': 'Models/Vinny_palm_point.json',
                'Ball': 'Models/ball.json',
            }, loadJSONResource, callback);
        },
        ShaderCode: function (callback){
            async.map({
                'NoShadow_VSText': 'shaders/chamber_shader_texture.vs.glsl',
                'NoShadow_FSText': 'shaders/chamber_shader_texture.fs.glsl',
                'Dither_VSText': 'shaders/chamber_shader_Knight_Helm.vs.glsl',
                'Dither_FSText': 'shaders/chamber_shader_dither_light.fs.glsl',
                'Color_FS': 'shaders/chamber_shader_color.fs.glsl',
                'Color_VS': 'shaders/chamber_shader_color.vs.glsl'
            }, loadTextResource, callback);

        },
        Textures: function (callback){
            async.map({
                'Vinny_Texture': 'textures/Vinny_Texture.png'
            }, loadImage, callback);
        }
    }, function(LoadErrors, LoadResults){
        if (LoadErrors){
            cb(LoadErrors);
            return;
        }

        //
        // Create Texture
        //

        // Vinny Texture
        var vinny_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, vinny_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Vinny_Texture
        );
        me.Vinny_Texture = vinny_texture;
        me.gl.bindTexture(me.gl.TEXTURE_2D, null);

        
        //
        // Create Model Objects
        //
        
        // console.log(LoadResults); //See mesh names


        //Ball Model

        var BallModel = LoadResults.Models.Ball;
        me.ball_scale = glMatrix.vec3.fromValues(0.1, 0.1, 0.1);
        me.BallMesh = new Model(
            me.gl,
            BallModel.meshes[0].vertices,
            [].concat.apply([], BallModel.meshes[0].faces),
            BallModel.meshes[0].normals,
            BallModel.meshes[0].texturecoords[0],
            me.Vinny_Texture,
            null,
            'Ball'
        );

        // Modification must be in order of: scale, totate , translate
        glMatrix.mat4.scale(
            me.BallMesh.world,         
            me.BallMesh.world,         
            glMatrix.vec3.fromValues(0.0, 0.0, 0.0) // scale X/Y/Z
        );

        glMatrix.mat4.translate(
            me.BallMesh.world, me.BallMesh.world,
            glMatrix.vec4.fromValues(0, 44, 4)
        );



        // Vinny Model
        me.vinny_scale = glMatrix.vec3.fromValues(0.3, 0.3, 0.3);
        me.zero_scale = glMatrix.vec3.fromValues(0.0, 0.0, 0.0);
        me.vinny_dialogue_position = glMatrix.vec4.fromValues(0, 0, 13);
        var outline_color = glMatrix.vec4.fromValues(0.5, 0.5, 0.5, 1);
        for (var i = 0; i < LoadResults.Models.Vinny_Bench.meshes.length; i++) {
			var mesh = LoadResults.Models.Vinny_Bench.meshes[i];
            
			switch (mesh.name) {
				case 'Vinny':
					me.Vinny_start = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        me.Vinny_Texture,
                        outline_color,
                        'Vincent'
					);
                    glMatrix.mat4.scale(
                        me.Vinny_start.world,         
                        me.Vinny_start.world,         
                        me.vinny_scale // scale X/Y/Z
                    );
					glMatrix.mat4.rotate(
						me.Vinny_start.world, me.Vinny_start.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Vinny_start.world, me.Vinny_start.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Vinny_start.world, me.Vinny_start.world,
						glMatrix.vec4.fromValues(0, 0, 0)
					);
					break;
				case 'Vinny_Outline':
					me.Vinny_Outline_start = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        outline_color,
                        'Vinny_Outline'
					);
                    glMatrix.mat4.scale(
                        me.Vinny_Outline_start.world,         
                        me.Vinny_Outline_start.world,         
                        me.vinny_scale
                    );
					glMatrix.mat4.rotate(
						me.Vinny_Outline_start.world, me.Vinny_Outline_start.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Vinny_Outline_start.world, me.Vinny_Outline_start.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Vinny_Outline_start.world, me.Vinny_Outline_start.world,
						glMatrix.vec4.fromValues(0, 0, 0)
					);
					break;
                case 'Book':
					me.Book = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        me.Vinny_Texture,
                        null,
                        'Book'
					);
                    glMatrix.mat4.scale(
                        me.Book.world,         
                        me.Book.world,         
                        me.vinny_scale // scale X/Y/Z
                    );
					glMatrix.mat4.rotate(
						me.Book.world, me.Book.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Book.world, me.Book.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Book.world, me.Book.world,
						glMatrix.vec4.fromValues(0, 0, 0)
					);
					break;
				case 'Book_Outline':
					me.Book_Outline = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        outline_color,
                        'Book_Outline'
					);
                    glMatrix.mat4.scale(
                        me.Book_Outline.world,         
                        me.Book_Outline.world,         
                        me.vinny_scale
                    );
					glMatrix.mat4.rotate(
						me.Book_Outline.world, me.Book_Outline.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Book_Outline.world, me.Book_Outline.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Book_Outline.world, me.Book_Outline.world,
						glMatrix.vec4.fromValues(0, 0, 0)
					);
					break;
                case 'Bench':
					me.Bench = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        me.Vinny_Texture,
                        null,
                        'Bench'
					);
                    glMatrix.mat4.scale(
                        me.Bench.world,         
                        me.Bench.world,         
                        me.vinny_scale // scale X/Y/Z
                    );
					glMatrix.mat4.rotate(
						me.Bench.world, me.Bench.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Bench.world, me.Bench.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Bench.world, me.Bench.world,
						glMatrix.vec4.fromValues(0, 0, 0)
					);
					break;
				case 'Bench_Outline':
					me.Bench_Outline = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        outline_color,
                        'Bench_Outline'
					);
                    glMatrix.mat4.scale(
                        me.Bench_Outline.world,         
                        me.Bench_Outline.world,         
                        me.vinny_scale
                    );
					glMatrix.mat4.rotate(
						me.Bench_Outline.world, me.Bench_Outline.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Bench_Outline.world, me.Bench_Outline.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Bench_Outline.world, me.Bench_Outline.world,
						glMatrix.vec4.fromValues(0, 0, 0)
					);
					break;
			}
		}

        // Point Up model
        for (var i = 0; i < LoadResults.Models.Vinny_Point_Up.meshes.length; i++) {
			var mesh = LoadResults.Models.Vinny_Point_Up.meshes[i];
            
			switch (mesh.name) {
				case 'Vinny':
					me.Vinny_Point_Up = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        me.Vinny_Texture,
                        outline_color,
                        'Vinny'
					);
                    glMatrix.mat4.scale(
                        me.Vinny_Point_Up.world,         
                        me.Vinny_Point_Up.world,         
                        me.zero_scale // scale X/Y/Z
                    );
					glMatrix.mat4.rotate(
						me.Vinny_Point_Up.world, me.Vinny_Point_Up.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Vinny_Point_Up.world, me.Vinny_Point_Up.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Vinny_Point_Up.world, me.Vinny_Point_Up.world,
						me.vinny_dialogue_position
					);
					break;
				case 'Outline':
					me.Vinny_Outline_point_up = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        outline_color,
                        'Vinny_Outline'
					);
                    glMatrix.mat4.scale(
                        me.Vinny_Outline_point_up.world,         
                        me.Vinny_Outline_point_up.world,         
                        me.zero_scale
                    );
					glMatrix.mat4.rotate(
						me.Vinny_Outline_point_up.world, me.Vinny_Outline_point_up.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Vinny_Outline_point_up.world, me.Vinny_Outline_point_up.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Vinny_Outline_point_up.world, me.Vinny_Outline_point_up.world,
						me.vinny_dialogue_position
					);
					break;
            }
        }

        // Crossed Arms model
        for (var i = 0; i < LoadResults.Models.Vinny_Crossed_Arms.meshes.length; i++) {
			var mesh = LoadResults.Models.Vinny_Crossed_Arms.meshes[i];
            
			switch (mesh.name) {
				case 'Vinny':
					me.Vinny_Crossed_arms = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        me.Vinny_Texture,
                        outline_color,
                        'Vinny'
					);
                    glMatrix.mat4.scale(
                        me.Vinny_Crossed_arms.world,         
                        me.Vinny_Crossed_arms.world,         
                        me.zero_scale // scale X/Y/Z
                    );
					glMatrix.mat4.rotate(
						me.Vinny_Crossed_arms.world, me.Vinny_Crossed_arms.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Vinny_Crossed_arms.world, me.Vinny_Crossed_arms.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Vinny_Crossed_arms.world, me.Vinny_Crossed_arms.world,
						me.vinny_dialogue_position
					);
					break;
				case 'Outline':
					me.Vinny_Outline_crossed_arms = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        outline_color,
                        'Vinny_Outline'
					);
                    glMatrix.mat4.scale(
                        me.Vinny_Outline_crossed_arms.world,         
                        me.Vinny_Outline_crossed_arms.world,         
                        me.zero_scale
                    );
					glMatrix.mat4.rotate(
						me.Vinny_Outline_crossed_arms.world, me.Vinny_Outline_crossed_arms.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Vinny_Outline_crossed_arms.world, me.Vinny_Outline_crossed_arms.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Vinny_Outline_crossed_arms.world, me.Vinny_Outline_crossed_arms.world,
						me.vinny_dialogue_position
					);
					break;
            }
        }

        // Palm point
        for (var i = 0; i < LoadResults.Models.Vinny_Palm_Point.meshes.length; i++) {
			var mesh = LoadResults.Models.Vinny_Palm_Point.meshes[i];
            
			switch (mesh.name) {
				case 'Vinny':
					me.Vinny_Point_Palm = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        me.Vinny_Texture,
                        outline_color,
                        'Vinny'
					);
                    glMatrix.mat4.scale(
                        me.Vinny_Point_Palm.world,         
                        me.Vinny_Point_Palm.world,         
                        me.zero_scale // scale X/Y/Z
                    );
					glMatrix.mat4.rotate(
						me.Vinny_Point_Palm.world, me.Vinny_Point_Palm.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Vinny_Point_Palm.world, me.Vinny_Point_Palm.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Vinny_Point_Palm.world, me.Vinny_Point_Palm.world,
						me.vinny_dialogue_position
					);
                    me.Vinny_Point_Palm.baseWorld = glMatrix.mat4.clone(me.Vinny_Point_Palm.world);
					break;
				case 'Outline':
					me.Vinny_Outline_point_palm = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        outline_color,
                        'Vinny_Outline'
					);
                    glMatrix.mat4.scale(
                        me.Vinny_Outline_point_palm.world,         
                        me.Vinny_Outline_point_palm.world,         
                        me.zero_scale
                    );
					glMatrix.mat4.rotate(
						me.Vinny_Outline_point_palm.world, me.Vinny_Outline_point_palm.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
					);
                    glMatrix.mat4.rotate(
						me.Vinny_Outline_point_palm.world, me.Vinny_Outline_point_palm.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
					);
					glMatrix.mat4.translate(
						me.Vinny_Outline_point_palm.world, me.Vinny_Outline_point_palm.world,
						me.vinny_dialogue_position
					);
					break;
            }
        }

        
        if (!me.Vinny_start){
            cb('failed to load Vincent mesh');
            return;
        }
        if (!me.Vinny_Outline_start){
            cb('failed to load Vincent outline mesh');
            return;
        }
        if (!me.Book){
            cb('failed to load Vincent outline mesh');
            return;
        }
        if (!me.Book_Outline){
            cb('failed to load Vincent outline mesh');
            return;
        }
        if (!me.Bench){
            cb('failed to load Vincent outline mesh');
            return;
        }
        if (!me.Bench_Outline){
            cb('failed to load Vincent outline mesh');
            return;
        }
        if (!me.Vinny_Point_Up){
            cb('failed to load Vincent outline mesh');
            return;
        }
        if (!me.Vinny_Outline_point_up){
            cb('failed to load Vincent outline mesh');
            return;
        }
        if (!me.Vinny_Crossed_arms){
            cb('failed to load Vincent crossed arms mesh');
            return;
        }
        if (!me.Vinny_Outline_crossed_arms){
            cb('failed to load Vincent outline crossed arms mesh');
            return;
        }
        if (!me.Vinny_Point_Palm){
            cb('failed to load Vincent pont palm mesh');
            return;
        }
        if (!me.Vinny_Outline_point_palm){
            cb('failed to load Vincent outline crossed arms mesh');
            return;
        }
        if (!me.BallMesh){
            cb('failed to load Vincent outline crossed arms mesh');
            return;
        }
        

        // VARIABLES
        me.Meshes = [ me.Vinny_start, me.Book, me.Bench, me.Vinny_Point_Palm, me.Vinny_Point_Up, me.Vinny_Crossed_arms];
        me.Outlines = [me.Vinny_Outline_point_palm,me.Vinny_Outline_start,me.Book_Outline,me.Bench_Outline,me.Vinny_Outline_point_up,me.Vinny_Outline_crossed_arms];
        me.Dialogue_Meshes = [
            me.Vinny_Crossed_arms, me.Vinny_Outline_crossed_arms,
            me.Vinny_Point_Palm, me.Vinny_Outline_point_palm,
            me.Vinny_Point_Up, me.Vinny_Outline_point_up
        ]
        me.Dither_Meshes = [me.BallMesh];
        // me.Vinny_Outline_start,me.Book_Outline, me.Bench_Outline
        //Light position
        me.lightPosition = glMatrix.vec3.fromValues(0.0, 8.0, 4.0);

        //DitherVariables
        me.is_dither_enabled = 1.0
        me.grid_size = 2.0
        me.pixel_ratio = 1.0
        me.is_color_inverted = 0.0
        me.grayscale = 0.0
        me.quantize_value = 10.0
        me.threshold = 0.3
        me.lit = 1.0

        


        //
        // Create Shaders
        //

        me.NoShadowProgram = CreateShaderProgram(
            me.gl, LoadResults.ShaderCode.NoShadow_VSText,
            LoadResults.ShaderCode.NoShadow_FSText
        );

        me.DitherProgram = CreateShaderProgram(
            me.gl, LoadResults.ShaderCode.Dither_VSText,
            LoadResults.ShaderCode.Dither_FSText
        );

        me.ColorProgram = CreateShaderProgram(
            me.gl, LoadResults.ShaderCode.Color_VS,
            LoadResults.ShaderCode.Color_FS
        );

        if (me.NoShadowProgram.error){
            cb('NoShadowProgram ' + me.NoShadowProgram.error); return;
        }
        if (me.ColorProgram.error){
            cb('NoShadowProgram ' + me.NoShadowProgram.error); return;
        }
        if (me.DitherProgram.error){
            cb('DitherProgram ' + me.NoShadowProgram.error); return;
        }

        me.NoShadowProgram.uniforms = {
            mWorld: me.gl.getUniformLocation(me.NoShadowProgram, 'mWorld'),
            mView: me.gl.getUniformLocation(me.NoShadowProgram, 'mView'),
            mProj: me.gl.getUniformLocation(me.NoShadowProgram, 'mProj'),

            pointLightPosition: me.gl.getUniformLocation(me.NoShadowProgram, 'pointLightPosition'),
			// meshColor: me.gl.getUniformLocation(me.NoShadowProgram, 'meshColor')

        };
        me.ColorProgram.uniforms = {
            mWorld: me.gl.getUniformLocation(me.ColorProgram, 'mWorld'),
            mView: me.gl.getUniformLocation(me.ColorProgram, 'mView'),
            mProj: me.gl.getUniformLocation(me.ColorProgram, 'mProj'),

            pointLightPosition: me.gl.getUniformLocation(me.ColorProgram, 'pointLightPosition'),
			meshColor: me.gl.getUniformLocation(me.ColorProgram, 'meshColor')

        };
        me.DitherProgram.uniforms = {
            // model: me.gl.getUniformLocation(me.DitherProgram, 'model'),
            // view: me.gl.getUniformLocation(me.DitherProgram, 'view'),
            // projection: me.gl.getUniformLocation(me.DitherProgram, 'projection'),
           
            
            mWorld: me.gl.getUniformLocation(me.DitherProgram, 'mWorld'),
            mView: me.gl.getUniformLocation(me.DitherProgram, 'mView'),
            mProj: me.gl.getUniformLocation(me.DitherProgram, 'mProj'),


            // map: me.gl.getUniformLocation(me.DitherProgram, 'map'),

            ditheringEnabled: me.gl.getUniformLocation(me.DitherProgram, 'ditheringEnabled'),
            gridSize: me.gl.getUniformLocation(me.DitherProgram, 'gridSize'),
            invertColor: me.gl.getUniformLocation(me.DitherProgram, 'invertColor'),
            pixelSizeRatio: me.gl.getUniformLocation(me.DitherProgram, 'pixelSizeRatio'),
            grayscaleOnly: me.gl.getUniformLocation(me.DitherProgram, 'grayscaleOnly'),
            QuantizeColor: me.gl.getUniformLocation(me.DitherProgram, 'QuantizeColor'),
            BelowThresholdRatio: me.gl.getUniformLocation(me.DitherProgram, 'BelowThresholdRatio'),
            pointLightPosition: me.gl.getUniformLocation(me.DitherProgram, 'pointLightPosition'),
            Is_Lit: me.gl.getUniformLocation(me.DitherProgram, 'Is_Lit')
            
        };

        me.DitherProgram.attribs = {
            vPos: me.gl.getAttribLocation(me.DitherProgram, 'vPos'),
			vNorm: me.gl.getAttribLocation(me.DitherProgram, 'vNorm'),
            texCoordAttributeLocation: me.gl.getAttribLocation(me.DitherProgram, 'vertTextCoord')
        };


        me.NoShadowProgram.attribs = {
            vPos: me.gl.getAttribLocation(me.NoShadowProgram, 'vPos'),
			vNorm: me.gl.getAttribLocation(me.NoShadowProgram, 'vNorm'),
            texCoordAttributeLocation: me.gl.getAttribLocation(me.NoShadowProgram, 'vertTextCoord')
        };

        me.ColorProgram.attribs = {
            vPos: me.gl.getAttribLocation(me.ColorProgram, 'vPos'),
			vNorm: me.gl.getAttribLocation(me.ColorProgram, 'vNorm'),
            texCoordAttributeLocation: me.gl.getAttribLocation(me.ColorProgram, 'vertTextCoord')
        };

        //
        // Logical values
        //

        me.is_camera_ortho = false;
        me.can_cam_move = true;

        


        me.camera = new Camera(
            glMatrix.vec3.fromValues(-1, 0.4, 0),
            glMatrix.vec3.fromValues(0, 0.4, 0),
            glMatrix.vec3.fromValues(0, 1, 0)
        );

        me.projMatrix = glMatrix.mat4.create()
        me.viewMatrix = glMatrix.mat4.create()
        glMatrix.mat4.perspective(
            me.projMatrix,
            glMatrix.glMatrix.toRadian(60), //FOV
            me.gl.canvas.width / me.gl.canvas.height,
            0.01, 
            200.0
        );

        
        // signal successful load
        if (cb) cb(null);
    });

    me.PressedKeys = {
        Up: false,
        Right: false,
        Down: false,
        Left: false,
        Forward: false,
        Back: false,

        RotLeft: false,
        RotRight: false,
        F: false
    };

    me.MoveForwardSpeed = 2;
	me.RotateSpeed = 1;
    
};

DemoScene.prototype.Unload = function (){
    this.ChamberMesh = null;
    this.NoShadowProgram = null;
    this.DitherProgram = null;
    this.ColorProgram = null;
    this.camera = null;
    this.lightPosition = null;
    this.Meshes = null;
    this.Outlines = null;
    this.Dialogue_Meshes = null;
    me.PressedKeys = null;
};

DemoScene.prototype.Begin = function (){
    console.log('Beginning demo scene');
    var me = this;

    // Add event listeners
    this.__ResizeWindowListener = this._OnResizeWindow.bind(this);
    this.__KeyDownListener = this._onKeyDown.bind(this);
    this.__KeyUpListener = this._onKeyUp.bind(this);

    AddEvent(window, 'resize', this.__ResizeWindowListener);
    AddEvent(window, 'keydown', this.__KeyDownListener);
    AddEvent(window, 'keyup', this.__KeyUpListener);

    // Render Loop
    var previuousFrame = performance.now();
    var dt = 0;
    var loop = function (currentFrameTime){
        dt = currentFrameTime - previuousFrame;
        me._Update(dt);
        previuousFrame = currentFrameTime;

        me._Outlines();
        me._Render();
        me._Dither();

        me.nextFrameHandle = requestAnimationFrame(loop);
    };
    me.nextFrameHandle = requestAnimationFrame(loop);

    me._OnResizeWindow();
};

DemoScene.prototype.End = function (){
    if(this.__ResizeWindowListener){
        RemoveEvent(window, 'resize', this.__ResizeWindowListener);
    }
    if(this.__KeyDownListener){
        RemoveEvent(window, 'keydown', this.__KeyDownListener);
    }
    if(this.__KeyUpListener){
        RemoveEvent(window, 'keyup', this.__KeyUpListener);
    }

    if (this.nextFrameHandle){
        cancelAnimationFrame(this.nextFrameHandle);
    }
};

//
// Priv Methods
//

function show_image(src, width, height,alt) {
    // Create a new image element
    let img = document.createElement("img");

    // Set the source, width, 
    // height, and alt attributes
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;

    // Append the image element
    // to the body of the document
    document.body.appendChild(img);
}

DemoScene.prototype._Update = function (dt) {
    // glMatrix.mat4.rotateZ(
    //     this.BenchMesh.world, this.BenchMesh.world,
    //     dt/1000 * 2 * Math.PI *   (0.3)//rotations per second
    // );

    

    //Raycast from camera
    this.rayOrigin = this.camera.position;
    this.rayDirection = this.camera.forward;
    this.rayLength = 3;
    this.intersectRadius = 0.5;
    this.maxInteractionRange = 1;

    for (let model of this.Meshes) {
        // Extract position from model.world matrix
        let modelCenter = glMatrix.vec3.fromValues(
            model.world[12], // x
            model.world[13], // y
            model.world[14]  // z
        );

        if (raySphereIntersect(this.rayOrigin, this.rayDirection, modelCenter, this.intersectRadius, this.maxInteractionRange)) {
            // console.log("Looking at model!", model.name);
            InitiateConversation(model.name, 1, this.PressedKeys.F);
        }else{
            InitiateConversation(model.name, 0, null);
        }
    }


    if (this.PressedKeys.Forward && !this.PressedKeys.Back && this.can_cam_move == true) {
		this.camera.moveForward(dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.Back && !this.PressedKeys.Forward && this.can_cam_move == true) {
		this.camera.moveForward(-dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.Right && !this.PressedKeys.Left && this.can_cam_move == true) {
		this.camera.moveRight(dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.Left && !this.PressedKeys.Right && this.can_cam_move == true) {
		this.camera.moveRight(-dt / 1000 * this.MoveForwardSpeed);
	}

	// if (this.PressedKeys.Up && !this.PressedKeys.Down && this.can_cam_move == true) {
	// 	this.camera.moveUp(dt / 1000 * this.MoveForwardSpeed);
	// }

	// if (this.PressedKeys.Down && !this.PressedKeys.Up && this.can_cam_move == true) {
	// 	this.camera.moveUp(-dt / 1000 * this.MoveForwardSpeed);
	// }

	if (this.PressedKeys.RotRight && !this.PressedKeys.RotLeft && this.can_cam_move == true) {
		this.camera.rotateRight(-dt / 1000 * this.RotateSpeed);
	}

	if (this.PressedKeys.RotLeft && !this.PressedKeys.RotRight && this.can_cam_move == true) {
		this.camera.rotateRight(dt / 1000 * this.RotateSpeed);
	}
    this.camera.GetViewMatrix(this.viewMatrix);
    // console.log(this.camera.position);
};

DemoScene.prototype._Outlines = function (){
    var gl = this.gl;

    // Clear back buffer, set per-frame uniforms
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0.0, 0.0, 0.0, 1); //Background color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    gl.useProgram(this.ColorProgram);
    gl.uniformMatrix4fv(this.ColorProgram.uniforms.mProj, gl.FALSE, this.projMatrix);
    gl.uniformMatrix4fv(this.ColorProgram.uniforms.mView, gl.FALSE, this.viewMatrix);
    gl.uniform3fv(this.ColorProgram.uniforms.pointLightPosition, this.lightPosition);

   
    

    // Draw meshes

    for (var i = 0; i < this.Outlines.length; i++){

        //Set Texture for each model
        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, this.Outlines[i].texture);
        // gl.uniform1i(this.ColorProgram.uniforms.diffuseTexture, 0);

        // Per object uniforms
        gl.uniform4fv(
            this.ColorProgram.uniforms.meshColor,
            this.Outlines[i].color
        );

        gl.uniformMatrix4fv(
            this.ColorProgram.uniforms.mWorld,
            gl.FALSE,
            this.Outlines[i].world
        );
        

        // Set Atribs
        gl.bindBuffer(gl.ARRAY_BUFFER, this.Outlines[i].vbo);
        gl.vertexAttribPointer(
            this.ColorProgram.attribs.vPos,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.ColorProgram.attribs.vPos);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.Outlines[i].nbo);
        gl.vertexAttribPointer(
            this.ColorProgram.attribs.vNorm,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.ColorProgram.attribs.vNorm);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Outlines[i].ibo);
        gl.drawElements(gl.TRIANGLES, this.Outlines[i].nPoints, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}

DemoScene.prototype._Render = function () {
    var gl = this.gl;

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    // gl.clearColor(0, 0, 0, 1);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    gl.useProgram(this.NoShadowProgram);
    gl.uniformMatrix4fv(this.NoShadowProgram.uniforms.mProj, gl.FALSE, this.projMatrix);
    gl.uniformMatrix4fv(this.NoShadowProgram.uniforms.mView, gl.FALSE, this.viewMatrix);
    gl.uniform3fv(this.NoShadowProgram.uniforms.pointLightPosition, this.lightPosition);

   
    

    // Draw meshes

    for (var i = 0; i < this.Meshes.length; i++){

        //Set Texture for each model
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.Meshes[i].texture);
        gl.uniform1i(this.NoShadowProgram.uniforms.diffuseTexture, 0);

        // Per object uniforms
        gl.uniformMatrix4fv(
            this.NoShadowProgram.uniforms.mWorld,
            gl.FALSE,
            this.Meshes[i].world
        );
        

        // Set Atribs
        gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].vbo);
        gl.vertexAttribPointer(
            this.NoShadowProgram.attribs.vPos,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.NoShadowProgram.attribs.vPos);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].nbo);
        gl.vertexAttribPointer(
            this.NoShadowProgram.attribs.vNorm,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.NoShadowProgram.attribs.vNorm);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].tbo);
        gl.vertexAttribPointer(
            this.NoShadowProgram.attribs.texCoordAttributeLocation, //Attribute location
            2, //Number of elements per attribute (vecX) color
            gl.FLOAT, //Type of elements
            gl.FALSE, //Is data normalised
            2 * Float32Array.BYTES_PER_ELEMENT,//Size of an individual vertex
            0 //Offset from the beginning of a single vertex to tris attribute
        );
        gl.enableVertexAttribArray(this.NoShadowProgram.attribs.texCoordAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Meshes[i].ibo);
        gl.drawElements(gl.TRIANGLES, this.Meshes[i].nPoints, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }


};




DemoScene.prototype._Dither = function () {
    const gl = this.gl;

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(this.DitherProgram);

    gl.uniformMatrix4fv(this.DitherProgram.uniforms.mProj, gl.FALSE, this.projMatrix);
    gl.uniformMatrix4fv(this.DitherProgram.uniforms.mView, gl.FALSE, this.viewMatrix);
    gl.uniform3fv(this.DitherProgram.uniforms.pointLightPosition, this.lightPosition);

    // Set global uniforms
    // gl.uniformMatrix4fv(this.DitherProgram.uniforms.projection, gl.FALSE, this.projMatrix);
    // gl.uniformMatrix4fv(this.DitherProgram.uniforms.view, gl.FALSE, this.viewMatrix);

    //set dithering shader parameters
    gl.uniform1f(this.DitherProgram.uniforms.ditheringEnabled, this.is_dither_enabled);
    gl.uniform1f(this.DitherProgram.uniforms.gridSize, this.grid_size);        // can change
    gl.uniform1f(this.DitherProgram.uniforms.pixelSizeRatio, this.pixel_ratio);  // can change
    gl.uniform1f(this.DitherProgram.uniforms.invertColor, this.is_color_inverted);     // can change
    gl.uniform1f(this.DitherProgram.uniforms.grayscaleOnly, this.grayscale);   // can changed
    gl.uniform1f(this.DitherProgram.uniforms.QuantizeColor, this.quantize_value);   // can change
    gl.uniform1f(this.DitherProgram.uniforms.BelowThresholdRatio, this.threshold);   // can change
    gl.uniform1f(this.DitherProgram.uniforms.Is_Lit, this.lit);

    // Draw each mesh
    for (let i = 0; i < this.Dither_Meshes.length; i++) {
        //Set Texture for each model
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.Dither_Meshes[i].texture);
        gl.uniform1i(this.DitherProgram.uniforms.diffuseTexture, 0);

        // Per object uniforms
        gl.uniformMatrix4fv(
            this.DitherProgram.uniforms.mWorld,
            gl.FALSE,
            this.Dither_Meshes[i].world
        );
        

        // Set Atribs
        gl.bindBuffer(gl.ARRAY_BUFFER, this.Dither_Meshes[i].vbo);
        gl.vertexAttribPointer(
            this.DitherProgram.attribs.vPos,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.DitherProgram.attribs.vPos);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.Dither_Meshes[i].nbo);
        gl.vertexAttribPointer(
            this.DitherProgram.attribs.vNorm,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.DitherProgram.attribs.vNorm);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.Dither_Meshes[i].tbo);
        gl.vertexAttribPointer(
            this.DitherProgram.attribs.texCoordAttributeLocation, //Attribute location
            2, //Number of elements per attribute (vecX) color
            gl.FLOAT, //Type of elements
            gl.FALSE, //Is data normalised
            2 * Float32Array.BYTES_PER_ELEMENT,//Size of an individual vertex
            0 //Offset from the beginning of a single vertex to tris attribute
        );
        gl.enableVertexAttribArray(this.DitherProgram.attribs.texCoordAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Dither_Meshes[i].ibo);
        gl.drawElements(gl.TRIANGLES, this.Dither_Meshes[i].nPoints, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
};


//
// Event Listeners
//

DemoScene.prototype._OnResizeWindow = function(){
    var gl = this.gl;
    var container = document.querySelector(".container");

    var targetHeight = window.innerWidth * 9 / 16;

	if (window.innerHeight > targetHeight) {
		// Center vertically
		gl.canvas.width = window.innerWidth;
		gl.canvas.height = targetHeight;
		gl.canvas.style.left = '0px';
		gl.canvas.style.top = (window.innerHeight - targetHeight) / 2 + 'px';
	} else {
		// Center horizontally
		gl.canvas.width = window.innerHeight * 16 / 9;
		gl.canvas.height = window.innerHeight;
		gl.canvas.style.left = (window.innerWidth - (gl.canvas.width)) / 2 + 'px';
		gl.canvas.style.top = '0px';
	}

    container.style.width = gl.canvas.width + "px";
    container.style.height = gl.canvas.height + "px";
    container.style.position = "absolute";
    container.style.left = gl.canvas.style.left;
    container.style.top = gl.canvas.style.top;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    if (this.is_camera_ortho == false){
        glMatrix.mat4.perspective(
            this.projMatrix,
            glMatrix.glMatrix.toRadian(90),
            gl.canvas.width / gl.canvas.height,
            0.01, 
            200.0
        );
    }
    else{
        const aspect = gl.canvas.width / gl.canvas.height;
        const size = 10;
        const fov = glMatrix.glMatrix.toRadian(60);
        const matchDistance = 0.5;

        const visibleHeight = 2 * matchDistance * Math.tan(fov / 2);
        const visibleWidth = visibleHeight * aspect;


        glMatrix.mat4.ortho(
            this.projMatrix,
            -visibleWidth / 2,
            visibleWidth / 2,
            -visibleHeight / 2,
            visibleHeight / 2,
            0.1,
            1000.0
        );

    }
    
   

    
};

DemoScene.prototype._onKeyDown = function (e){
    switch(e.code) {
		case 'KeyW':
			this.PressedKeys.Forward = true;
			break;
		case 'KeyA':
			this.PressedKeys.Left = true;
			break;
		case 'KeyD':
			this.PressedKeys.Right = true;
			break;
		case 'KeyS':
			this.PressedKeys.Back = true;
			break;
		case 'ArrowUp':
			this.PressedKeys.Up = true;
			break;
		case 'ArrowDown':
			this.PressedKeys.Down = true;
			break;
		case 'KeyE':
			this.PressedKeys.RotRight = true;
			break;
		case 'KeyQ':
			this.PressedKeys.RotLeft = true;
			break;
        case 'KeyF':
            this.PressedKeys.F = true;
	}
    // console.log(e);

};

DemoScene.prototype._onKeyUp = function (e){
    switch(e.code) {
		case 'KeyW':
			this.PressedKeys.Forward = false;
			break;
		case 'KeyA':
			this.PressedKeys.Left = false;
			break;
		case 'KeyD':
			this.PressedKeys.Right = false;
			break;
		case 'KeyS':
			this.PressedKeys.Back = false;
			break;
		case 'ArrowUp':
			this.PressedKeys.Up = false;
			break;
		case 'ArrowDown':
			this.PressedKeys.Down = false;
			break;
		case 'KeyE':
			this.PressedKeys.RotRight = false;
			break;
		case 'KeyQ':
			this.PressedKeys.RotLeft = false;
			break;
        case 'KeyF':
            this.PressedKeys.F = false;
	}

};

DemoScene.prototype.Show_Ball  = function(is_ball_showing){
    glMatrix.mat4.identity(this.BallMesh.world);
    if (is_ball_showing == true){
        glMatrix.mat4.scale(
            this.BallMesh.world,         
            this.BallMesh.world,         
            this.ball_scale
        );
    }else{
        glMatrix.mat4.scale(
            this.BallMesh.world,         
            this.BallMesh.world,         
            glMatrix.vec3.fromValues(0.0, 0.0, 0.0)
        );
    }
    glMatrix.mat4.translate(
        this.BallMesh.world, this.BallMesh.world,
        glMatrix.vec4.fromValues(0, 44, 4)
    );
}

DemoScene.prototype.Dialogue_Meshes_rescale = function(current_mesh){
    // 0 - crossed arms
    // 2 - palm
    // 4 - pont up

    for (var i = 0; i < this.Dialogue_Meshes.length; i++){
        glMatrix.mat4.identity(this.Dialogue_Meshes[i].world);

        if(i == current_mesh || i == current_mesh + 1){
            glMatrix.mat4.scale(
                this.Dialogue_Meshes[i].world,         
                this.Dialogue_Meshes[i].world,         
                this.vinny_scale
            );
        }
        else{
            glMatrix.mat4.scale(
                this.Dialogue_Meshes[i].world,         
                this.Dialogue_Meshes[i].world,         
               glMatrix.vec3.fromValues(0.0, 0.0, 0.0)
            );
        }

        glMatrix.mat4.rotate(
            this.Dialogue_Meshes[i].world,  this.Dialogue_Meshes[i].world,
            glMatrix.glMatrix.toRadian(90),
            glMatrix.vec3.fromValues(-1, 0, 0)
        );
        glMatrix.mat4.rotate(
            this.Dialogue_Meshes[i].world,  this.Dialogue_Meshes[i].world,
            glMatrix.glMatrix.toRadian(90),
            glMatrix.vec3.fromValues(0, 0, -1)
        );
        glMatrix.mat4.translate(
            this.Dialogue_Meshes[i].world, this.Dialogue_Meshes[i].world,
            this.vinny_dialogue_position
        );
    }
}

DemoScene.prototype.Set_Dither_Shader_Variabled = function(dither, grid, ratio, inv_color, gscale, quantize, thresh_val, lot_val){

    if(dither !== undefined)        {this.is_dither_enabled =  dither;}
    if(grid !== undefined)          {this.grid_size = grid;}
    if(ratio !== undefined)         {this.pixel_ratio = ratio;}
    if(inv_color !== undefined)     {this.is_color_inverted = inv_color;}
    if(gscale !== undefined)        {this.grayscale = gscale;}
    if(quantize !== undefined)      {this.quantize_value = quantize;}
    if(thresh_val !== undefined)    {this.threshold = thresh_val;}
    if(lot_val !== undefined)       {this.lit = lot_val;}
}