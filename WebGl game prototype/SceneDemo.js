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
                'Cube': 'Models/cube.json',
                'Ornstein': 'Models/ornstein.json',
                'Picture_Plane': 'Models/plane.json'
            }, loadJSONResource, callback);
        },
        ShaderCode: function (callback){
            async.map({
                'NoShadow_VSText': 'shaders/chamber_shader_texture.vs.glsl',
                'NoShadow_FSText': 'shaders/chamber_shader_texture.fs.glsl',
                'Dither_VSText': 'shaders/chamber_shader_Knight_Helm.vs.glsl',
                'Dither_FSText': 'shaders/chamber_shader_dither_light.fs.glsl',
                'Color_FS': 'shaders/chamber_shader_color.fs.glsl',
                'Color_VS': 'shaders/chamber_shader_color.vs.glsl',
                'Normal_FS': 'shaders/normal_map.fs.glsl',
                'Normal_VS': 'shaders/normal_map.vs.glsl',
                'Specular_FS': 'shaders/specular.fs.glsl',
                'Specular_VS': 'shaders/specular.vs.glsl',
                'Post_Process_FS': 'shaders/post_process.fs.glsl',
                'Post_Process_VS': 'shaders/post_process.vs.glsl'
            }, loadTextResource, callback);

        },
        Textures: function (callback){
            async.map({
                'Vinny_Texture': 'textures/Vinny_Texture.png',
                'Cube_Texture': 'textures/number_grid.png',
                'Normal_Texture': 'textures/number_grid_normals.png',
                'Specular_Base_Texture': 'textures/container2.png',
                'Specular_Texture': 'textures/choso_specular.png',
                'Ornstein_Texture': 'textures/ornstein_helm.png',
                'Ornstein_Specular_Texture': 'textures/ornstein_helm_specular.png',
                'Ornstein_Hair_Texture': 'textures/ornstein_hair_diffuse.png',
                'Ornstein_Hair_Specular_Texture': 'textures/ornstein_hair_specular.png',
                'Gojo_Statue_Texture': 'textures/gojo_statue.png',
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

        // Cube Texture
        var cube_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, cube_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Cube_Texture
        );
        me.Cube_Texture = cube_texture;
        me.gl.bindTexture(me.gl.TEXTURE_2D, null);

        // NORMAL Texture
        var normal_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, normal_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Normal_Texture
        );
        me.Normal_Texture = normal_texture;
        me.gl.bindTexture(me.gl.TEXTURE_2D, null);

        //Specular Base
        var specular_base_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, specular_base_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Specular_Base_Texture
        );
        me.Specular_Base_Texture = specular_base_texture;
        me.gl.bindTexture(me.gl.TEXTURE_2D, null);

        //Specular texture
        var specular_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, specular_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Specular_Texture
        );
        me.Specular_Texture = specular_texture;
        me.gl.bindTexture(me.gl.TEXTURE_2D, null);

        //Ornstein_Texture
        var ornstein_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, ornstein_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Ornstein_Texture
        );
        me.Ornstein_Texture = ornstein_texture;
        me.gl.bindTexture(me.gl.TEXTURE_2D, null);

        //Ornstein_Specular_Texture
        var ornstein_specular_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, ornstein_specular_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Ornstein_Specular_Texture
        );
        me.Ornstein_Specular_Texture = ornstein_specular_texture;
        me.gl.bindTexture(me.gl.TEXTURE_2D, null);

        //Ornstein_Hair_Texture
        var ornstein_hair_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, ornstein_hair_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Ornstein_Hair_Texture
        );
        me.Ornstein_Hair_Texture = ornstein_hair_texture;
        me.gl.bindTexture(me.gl.TEXTURE_2D, null);

        //Ornstein_Hair_Specular_Texture
        var ornstein_hair_specular_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, ornstein_hair_specular_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Ornstein_Hair_Specular_Texture
        );
        me.Ornstein_Hair_Specular_Texture = ornstein_hair_specular_texture;
        me.gl.bindTexture(me.gl.TEXTURE_2D, null);

        //Gojo_Statue_Texture
        var gojo_statue_texture = me.gl.createTexture();
        me.gl.bindTexture(me.gl.TEXTURE_2D, gojo_statue_texture);
        me.gl.pixelStorei(me.gl.UNPACK_FLIP_Y_WEBGL, true);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_S, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_WRAP_T, me.gl.CLAMP_TO_EDGE);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MIN_FILTER, me.gl.LINEAR);
        me.gl.texParameteri(me.gl.TEXTURE_2D, me.gl.TEXTURE_MAG_FILTER, me.gl.LINEAR);

        me.gl.texImage2D(
            me.gl.TEXTURE_2D, 0, me.gl.RGBA, me.gl.RGBA, 
            me.gl.UNSIGNED_BYTE,
            LoadResults.Textures.Gojo_Statue_Texture
        );
        me.Gojo_Statue_Texture = gojo_statue_texture;
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
            null,
            me.Vinny_Texture,
            null,
            'Ball'
        );


        // Modification must be in order of: scale, rotate , translate
        glMatrix.mat4.scale(
            me.BallMesh.world,         
            me.BallMesh.world,         
            glMatrix.vec3.fromValues(0.0, 0.0, 0.0) // scale X/Y/Z
        );
        glMatrix.mat4.translate(
            me.BallMesh.world, me.BallMesh.world,
            glMatrix.vec4.fromValues(0, 44, 4)
        );


        //Box Model
        
        var BoxModel = LoadResults.Models.Cube;
        var box_color = glMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1);
        me.box_scale = glMatrix.vec3.fromValues(1.3, 1.3, 1.3);

        let tangents = generateTangents(BoxModel.meshes[0].vertices, BoxModel.meshes[0].normals, BoxModel.meshes[0].texturecoords[0], [].concat.apply([], BoxModel.meshes[0].faces));


        me.BoxMesh = new Model (
            me.gl,
            BoxModel.meshes[0].vertices,
            [].concat.apply([], BoxModel.meshes[0].faces),
            BoxModel.meshes[0].normals,
            BoxModel.meshes[0].texturecoords[0],
            tangents,
            me.Specular_Base_Texture,
            box_color,
            'Box'
        );
        glMatrix.mat4.scale(
            me.BoxMesh.world,         
            me.BoxMesh.world,         
            glMatrix.vec3.fromValues(0.0, 0.0, 0.0) // scale X/Y/Z
        );
        glMatrix.mat4.rotate(
            me.BoxMesh.world, me.BoxMesh.world,
            glMatrix.glMatrix.toRadian(90),
            glMatrix.vec3.fromValues(-1, 0, 0)
        );
        glMatrix.mat4.translate(
            me.BoxMesh.world, me.BoxMesh.world,
            glMatrix.vec4.fromValues(0, 4, 1)
        );

        //Picture_Plane
        var PlaneModel = LoadResults.Models.Picture_Plane;
        me.planePosition = glMatrix.vec4.fromValues(1.0, 29.3, 0);
        me.PlaneMesh = new Model (
            me.gl,
            PlaneModel.meshes[0].vertices,
            [].concat.apply([], PlaneModel.meshes[0].faces),
            PlaneModel.meshes[0].normals,
            PlaneModel.meshes[0].texturecoords[0],
            tangents,
            me.Gojo_Statue_Texture,
            box_color,
            'Box'
        );
        glMatrix.mat4.scale(
            me.PlaneMesh.world,         
            me.PlaneMesh.world,         
            glMatrix.vec3.fromValues(0.0, 0.0, 0.0) // scale X/Y/Z
        );
        glMatrix.mat4.rotate(
            me.PlaneMesh.world, me.PlaneMesh.world,
            glMatrix.glMatrix.toRadian(90),
            glMatrix.vec3.fromValues(0, -1, 0)
        );
        glMatrix.mat4.translate(
            me.PlaneMesh.world, me.PlaneMesh.world,
            me.planePosition
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
                    // console.log(mesh);
					me.Vinny_start = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        me.Vinny_Texture,
                        outline_color,
                        'Vincent'
					);
                    
                    // load_models({
                    //     target: me,
                    //     name: "Vinny_start",
                    //     gl: me.gl,
                    //     mesh: mesh,
                    //     texture: me.Vinny_Texture,
                    //     outlineColor: outline_color,
                    //     displayName: "Vincent"
                    // });
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
                        null,
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
                        null,
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
                        null,
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
                        null,
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





                    //PLACEHOLDER OVERWORLD MODEL
                    me.Vinny_Overworld_Plaacegolder_CrossArms = new Model(
                        me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        me.Vinny_Texture,
                        outline_color,
                        'Vinny_2'
                    );
                    glMatrix.mat4.scale(
                        me.Vinny_Overworld_Plaacegolder_CrossArms.world,
                        me.Vinny_Overworld_Plaacegolder_CrossArms.world,
                        me.vinny_scale
                    );
                    glMatrix.mat4.rotate(
                        me.Vinny_Overworld_Plaacegolder_CrossArms.world, me.Vinny_Overworld_Plaacegolder_CrossArms.world,
                        glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
                    );
                    glMatrix.mat4.rotate(
                        me.Vinny_Overworld_Plaacegolder_CrossArms.world, me.Vinny_Overworld_Plaacegolder_CrossArms.world,
                        glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
                    );
                    glMatrix.mat4.translate(
                        me.Vinny_Overworld_Plaacegolder_CrossArms.world, me.Vinny_Overworld_Plaacegolder_CrossArms.world,
                        glMatrix.vec4.fromValues(5, 0, 0)
                    );

                    //2nd
                    me.Vinny_Overworld_Plaacegolder_2_CrossArms = new Model(
                        me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        me.Vinny_Texture,
                        outline_color,
                        'Vinny_3'
                    );
                    glMatrix.mat4.scale(
                        me.Vinny_Overworld_Plaacegolder_2_CrossArms.world,
                        me.Vinny_Overworld_Plaacegolder_2_CrossArms.world,
                        me.vinny_scale
                    );
                    glMatrix.mat4.rotate(
                        me.Vinny_Overworld_Plaacegolder_2_CrossArms.world, me.Vinny_Overworld_Plaacegolder_2_CrossArms.world,
                        glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
                    );
                    glMatrix.mat4.rotate(
                        me.Vinny_Overworld_Plaacegolder_2_CrossArms.world, me.Vinny_Overworld_Plaacegolder_2_CrossArms.world,
                        glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
                    );
                    glMatrix.mat4.translate(
                        me.Vinny_Overworld_Plaacegolder_2_CrossArms.world, me.Vinny_Overworld_Plaacegolder_2_CrossArms.world,
                        glMatrix.vec4.fromValues(7, 0, 0)
                    );

                    //3rd
                    me.Vinny_Overworld_Plaacegolder_3_CrossArms = new Model(
                        me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        me.Vinny_Texture,
                        outline_color,
                        'Vinny_4'
                    );
                    glMatrix.mat4.scale(
                        me.Vinny_Overworld_Plaacegolder_3_CrossArms.world,
                        me.Vinny_Overworld_Plaacegolder_3_CrossArms.world,
                        me.vinny_scale
                    );
                    glMatrix.mat4.rotate(
                        me.Vinny_Overworld_Plaacegolder_3_CrossArms.world, me.Vinny_Overworld_Plaacegolder_3_CrossArms.world,
                        glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
                    );
                    glMatrix.mat4.rotate(
                        me.Vinny_Overworld_Plaacegolder_3_CrossArms.world, me.Vinny_Overworld_Plaacegolder_3_CrossArms.world,
                        glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
                    );
                    glMatrix.mat4.translate(
                        me.Vinny_Overworld_Plaacegolder_3_CrossArms.world, me.Vinny_Overworld_Plaacegolder_3_CrossArms.world,
                        glMatrix.vec4.fromValues(9, 0, 0)
                    );

                    //4th
                    me.Vinny_Overworld_Plaacegolder_4_CrossArms = new Model(
                        me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        me.Vinny_Texture,
                        outline_color,
                        'Vinny_5'
                    );
                    glMatrix.mat4.scale(
                        me.Vinny_Overworld_Plaacegolder_4_CrossArms.world,
                        me.Vinny_Overworld_Plaacegolder_4_CrossArms.world,
                        me.vinny_scale
                    );
                    glMatrix.mat4.rotate(
                        me.Vinny_Overworld_Plaacegolder_4_CrossArms.world, me.Vinny_Overworld_Plaacegolder_4_CrossArms.world,
                        glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(-1, 0, 0)
                    );
                    glMatrix.mat4.rotate(
                        me.Vinny_Overworld_Plaacegolder_4_CrossArms.world, me.Vinny_Overworld_Plaacegolder_4_CrossArms.world,
                        glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, 0, -1)
                    );
                    glMatrix.mat4.translate(
                        me.Vinny_Overworld_Plaacegolder_4_CrossArms.world, me.Vinny_Overworld_Plaacegolder_4_CrossArms.world,
                        glMatrix.vec4.fromValues(11, 0, 0)
                    );

                    //PLACEHOLDER END
					break;
				case 'Outline':
					me.Vinny_Outline_crossed_arms = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
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
                        null,
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


        // Ornstein model
        me.ornstein_position = glMatrix.vec4.fromValues(3, 44, 0);
        me.ornstein_scale = glMatrix.vec3.fromValues(0.1, 0.1, 0.1);
        for (var i = 0; i < LoadResults.Models.Ornstein.meshes.length; i++) {
			var mesh = LoadResults.Models.Ornstein.meshes[i];
			switch (mesh.name) {
				case 'Head':
					me.Ornstein = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        me.Ornstein_Texture,
                        outline_color,
                        'Helm'
					);
                    glMatrix.mat4.scale(
                        me.Ornstein.world,         
                        me.Ornstein.world,         
                        glMatrix.vec3.fromValues(0.0, 0.0, 0.0) // scale X/Y/Z
                    );
					glMatrix.mat4.rotate(
						me.Ornstein.world, me.Ornstein.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, -1, 0)
					);
					glMatrix.mat4.translate(
						me.Ornstein.world, me.Ornstein.world,
						me.ornstein_position
					);
                    // me.Ornstein.baseWorld = glMatrix.mat4.clone(me.Ornstein.world);
					break;
				case 'Hair':
					me.Ornstein_hair = new Model(
						me.gl,
						mesh.vertices,
						[].concat.apply([], mesh.faces),
						mesh.normals,
						mesh.texturecoords[0],
                        null,
                        me.Ornstein_Hair_Texture,
                        outline_color,
                        'Hair'
					);
                    glMatrix.mat4.scale(
                        me.Ornstein_hair.world,         
                        me.Ornstein_hair.world,         
                        glMatrix.vec3.fromValues(0.0, 0.0, 0.0) // scale X/Y/Z
                    );
					glMatrix.mat4.rotate(
						me.Ornstein_hair.world, me.Ornstein_hair.world,
						glMatrix.glMatrix.toRadian(90),
                        glMatrix.vec3.fromValues(0, -1, 0)
					);
					glMatrix.mat4.translate(
						me.Ornstein_hair.world, me.Ornstein_hair.world,
						me.ornstein_position
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
        if(!me.BoxMesh){
            cb('failed to load Vincent outline crossed arms mesh');
            return;
        }
        if(!me.Vinny_Overworld_Plaacegolder_CrossArms){
            cb('failed to load Vincent outline crossed arms mesh');
            return;
        }
        if(!me.Vinny_Overworld_Plaacegolder_2_CrossArms){
            cb('failed to load Vincent outline crossed arms mesh');
            return;
        }
        if(!me.Vinny_Overworld_Plaacegolder_3_CrossArms){
            cb('failed to load Vincent outline crossed arms mesh');
            return;
        }
         if(!me.Vinny_Overworld_Plaacegolder_4_CrossArms){
            cb('failed to load Vincent outline crossed arms mesh');
            return;
        }
        if(!me.Ornstein){
            cb('failed to load Ornstein mesh');
            return;
        }
        if(!me.Ornstein_hair){
            cb('failed to load Ornstein hair mesh');
            return;
        }
        if(!me.PlaneMesh){
            cb('failed to load Ornstein hair mesh');
            return;
        }
        
        // VARIABLES
        me.Meshes = [ me.Vinny_start, me.Book, me.Bench, me.Vinny_Point_Palm, me.Vinny_Point_Up, me.Vinny_Crossed_arms, me.Vinny_Overworld_Plaacegolder_CrossArms, me.Vinny_Overworld_Plaacegolder_2_CrossArms, me.Vinny_Overworld_Plaacegolder_3_CrossArms, me.Vinny_Overworld_Plaacegolder_4_CrossArms, me.PlaneMesh];
        me.Outlines = [me.Vinny_Outline_point_palm,me.Vinny_Outline_start,me.Book_Outline,me.Bench_Outline,me.Vinny_Outline_point_up,me.Vinny_Outline_crossed_arms];
        me.Dialogue_Meshes = [
            me.Vinny_Crossed_arms, me.Vinny_Outline_crossed_arms,
            me.Vinny_Point_Palm, me.Vinny_Outline_point_palm,
            me.Vinny_Point_Up, me.Vinny_Outline_point_up
        ]
        me.Dither_Meshes = [me.BallMesh];
        me.NormalMeshes = [me.BoxMesh]; //me.BoxMesh
        me.SpecularMeshes = [me.Ornstein, me.Ornstein_hair];
        me.SpecularTextures = [me.Ornstein_Specular_Texture, me.Ornstein_Hair_Specular_Texture, me.Specular_Texture];
        // me.Vinny_Outline_start,me.Book_Outline, me.Bench_Outline
        //Light position
        me.lightPosition = glMatrix.vec3.fromValues(0.0, 8.0, 4.0);
        me.lightPositionNormals = glMatrix.vec4.fromValues(0.4, 0.1, -0.33, 1.0);
        
        
        

        //DitherVariables
        me.is_dither_enabled = 1.0
        me.grid_size = 2.0
        me.pixel_ratio = 1.0
        me.is_color_inverted = 0.0
        me.grayscale = 0.0
        me.quantize_value = 10.0
        me.threshold = 0.3
        me.lit = 1.0

        //Normal variables
        me.textureWidth = 400;
        me.textureHeight = 400;
        me.isMapGenerated = 0;
        me.isLightRotating = false;
        me.useSpecular = false;

        //Specular variables
        me.use_spec_map = false;
        me.NormalShaderResultIndicator = 0;
        me.Ornstein_rotate = true;
        me.specular_intensity = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
        me.specular_swich = 1;
        me.enable_specular_demonstration = false;
       

        //Post process variables
        me.REDxOffset = 0.05;
        me.REDyOffset = 0.0;
        me.GREENxOffset = 0.0;
        me.GREENyOffset = 0.0;
        me.BLUExOffset = -0.05;
        me.BLUEyOffset = 0.0;
        me.PP_ColorChanels = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
        me.edgeColor = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
        me.enable_brightness_shift = false;

        me.useChromatic = false;
        me.useBlur = false;
        me.useDither = false;
        me.useSobel = false;
        me.useColor = true;
        me.useDuotone = false;
        me.useThreshold = true;

        me.DuotoneDark = glMatrix.vec3.fromValues(0.0, 0.5, 1.0);
        me.DuotoneLight = glMatrix.vec3.fromValues(0.2, 0.0, 0.5);

        me.mousePos = glMatrix.vec2.fromValues(0.0, 0.0);

        //Video
        me.copyVideo = false;
        me.videoTexture = initTexture(me.gl);
        me.video = setupVideo("textures/mesmer.mp4");

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

        me.NormalProgram = CreateShaderProgram(
            me.gl, LoadResults.ShaderCode.Normal_VS,
            LoadResults.ShaderCode.Normal_FS
        );

        me.SpecularProgram = CreateShaderProgram(
            me.gl, LoadResults.ShaderCode.Specular_VS,
            LoadResults.ShaderCode.Specular_FS
        );

        me.PostProcessProgram = CreateShaderProgram(
            me.gl, LoadResults.ShaderCode.Post_Process_VS,
            LoadResults.ShaderCode.Post_Process_FS
        );

        

        if (me.NoShadowProgram.error){
            cb('NoShadowProgram ' + me.NoShadowProgram.error); return;
        }
        if (me.ColorProgram.error){
            cb('ColorProgram ' + me.ColorProgram.error); return;
        }
        if (me.DitherProgram.error){
            cb('DitherProgram ' + me.DitherProgram.error); return;
        }
        if (me.NormalProgram.error){
            cb('NormalProgram ' + me.NormalProgram.error); return;
        }
        if (me.SpecularProgram.error){
            cb('SpecularProgram ' + me.SpecularProgram.error); return;
        }
        if (me.PostProcessProgram.error){
            cb('PostProcessProgram ' + me.PostProcessProgram.error); return;
        }

        me.NoShadowProgram.uniforms = {
            mWorld: me.gl.getUniformLocation(me.NoShadowProgram, 'mWorld'),
            mView: me.gl.getUniformLocation(me.NoShadowProgram, 'mView'),
            mProj: me.gl.getUniformLocation(me.NoShadowProgram, 'mProj'),

            pointLightPosition: me.gl.getUniformLocation(me.NoShadowProgram, 'pointLightPosition'),
			// meshColor: me.gl.getUniformLocation(me.NoShadowProgram, 'meshColor')

        };
        me.SpecularProgram.uniforms = {
            mWorld: me.gl.getUniformLocation(me.SpecularProgram, 'mWorld'),
            mView: me.gl.getUniformLocation(me.SpecularProgram, 'mView'),
            mProj: me.gl.getUniformLocation(me.SpecularProgram, 'mProj'),

            material_specular: me.gl.getUniformLocation(me.SpecularProgram, 'material_specular'),
            shininess: me.gl.getUniformLocation(me.SpecularProgram, 'shininess'),
            ambient: me.gl.getUniformLocation(me.SpecularProgram, 'ambient'),
            light_specular: me.gl.getUniformLocation(me.SpecularProgram, 'light_specular'),
            viewPos: me.gl.getUniformLocation(me.SpecularProgram, 'viewPos'),
            base_text: me.gl.getUniformLocation(me.SpecularProgram, 'base_text'),
            specular_text: me.gl.getUniformLocation(me.SpecularProgram, 'specular_text'),
            use_spec_map: me.gl.getUniformLocation(me.SpecularProgram, 'use_spec_map'),

            pointLightPosition: me.gl.getUniformLocation(me.SpecularProgram, 'pointLightPosition'),
			// meshColor: me.gl.getUniformLocation(me.SpecularProgram, 'meshColor')

        };
        me.ColorProgram.uniforms = {
            mWorld: me.gl.getUniformLocation(me.ColorProgram, 'mWorld'),
            mView: me.gl.getUniformLocation(me.ColorProgram, 'mView'),
            mProj: me.gl.getUniformLocation(me.ColorProgram, 'mProj'),

            pointLightPosition: me.gl.getUniformLocation(me.ColorProgram, 'pointLightPosition'),
			meshColor: me.gl.getUniformLocation(me.ColorProgram, 'meshColor')

        };
        me.DitherProgram.uniforms = {
            mWorld: me.gl.getUniformLocation(me.DitherProgram, 'mWorld'),
            mView: me.gl.getUniformLocation(me.DitherProgram, 'mView'),
            mProj: me.gl.getUniformLocation(me.DitherProgram, 'mProj'),

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
        me.NormalProgram.uniforms = {
            lightColor: me.gl.getUniformLocation(me.NormalProgram, 'lightColor'),
            lightPosition: me.gl.getUniformLocation(me.NormalProgram, 'lightPosition'),
            lightAttenuations: me.gl.getUniformLocation(me.NormalProgram, 'lightAttenuations'),
            materialAmbient: me.gl.getUniformLocation(me.NormalProgram, 'materialAmbient'),
            materialDiffuse: me.gl.getUniformLocation(me.NormalProgram, 'materialDiffuse'),
            materialSpecular: me.gl.getUniformLocation(me.NormalProgram, 'materialSpecular'),
            materialShininess: me.gl.getUniformLocation(me.NormalProgram, 'materialShininess'),
            map0: me.gl.getUniformLocation(me.NormalProgram, 'map0'),
            map1: me.gl.getUniformLocation(me.NormalProgram, 'map1'),
            normalMapResolution: me.gl.getUniformLocation(me.NormalProgram, 'normalMapResolution'),
            isMapGenerated: me.gl.getUniformLocation(me.NormalProgram, 'isMapGenerated'),
            renderResult: me.gl.getUniformLocation(me.NormalProgram, 'renderResult'),
            useSpecular: me.gl.getUniformLocation(me.NormalProgram, 'useSpecular'),
            
            matrixNormal: me.gl.getUniformLocation(me.NormalProgram, 'matrixNormal'),
            matrixModelView: me.gl.getUniformLocation(me.NormalProgram, 'matrixModelView'),
            matrixModelViewProjection: me.gl.getUniformLocation(me.NormalProgram, 'matrixModelViewProjection')
            
        };

        me.PostProcessProgram.uniforms = {
            // mWorld: me.gl.getUniformLocation(me.NoShadowProgram, 'mWorld'),
            // mView: me.gl.getUniformLocation(me.NoShadowProgram, 'mView'),
            // mProj: me.gl.getUniformLocation(me.NoShadowProgram, 'mProj'),

            sampler: me.gl.getUniformLocation(me.PostProcessProgram, 'sampler'),
            canvasResolution: me.gl.getUniformLocation(me.PostProcessProgram, 'canvasResolution'),
            windowResolution: me.gl.getUniformLocation(me.PostProcessProgram, 'windowResolution'),
            REDxOffset: me.gl.getUniformLocation(me.PostProcessProgram, 'REDxOffset'),
            REDyOffset: me.gl.getUniformLocation(me.PostProcessProgram, 'REDyOffset'),
            GREENxOffset: me.gl.getUniformLocation(me.PostProcessProgram, 'GREENxOffset'),
            GREENyOffset: me.gl.getUniformLocation(me.PostProcessProgram, 'GREENyOffset'),
            BLUExOffset: me.gl.getUniformLocation(me.PostProcessProgram, 'BLUExOffset'),
            BLUEyOffset: me.gl.getUniformLocation(me.PostProcessProgram, 'BLUEyOffset'),
            colorChanels: me.gl.getUniformLocation(me.PostProcessProgram, 'colorChanels'),
            edgeColor: me.gl.getUniformLocation(me.PostProcessProgram, 'edgeColor'),

            useCA: me.gl.getUniformLocation(me.PostProcessProgram, 'useCA'),
            useDither: me.gl.getUniformLocation(me.PostProcessProgram, 'useDither'),
            useSobel: me.gl.getUniformLocation(me.PostProcessProgram, 'useSobel'),
            useColor: me.gl.getUniformLocation(me.PostProcessProgram, 'useColor'),
            useDuotone: me.gl.getUniformLocation(me.PostProcessProgram, 'useDuotone'),
            DuotoneLight: me.gl.getUniformLocation(me.PostProcessProgram, 'DuotoneLight'),
            DuotoneDark: me.gl.getUniformLocation(me.PostProcessProgram, 'DuotoneDark'),
            mousePos: me.gl.getUniformLocation(me.PostProcessProgram, 'mousePos'),
            useBlur: me.gl.getUniformLocation(me.PostProcessProgram, 'useBlur'),
            useThreshold: me.gl.getUniformLocation(me.PostProcessProgram, 'useThreshold')
        };

        me.NormalProgram.attribs = {
            vertexPosition: me.gl.getAttribLocation(me.NormalProgram, 'vertexPosition'),
			vertexNormal: me.gl.getAttribLocation(me.NormalProgram, 'vertexNormal'),
            vertexTexCoord0: me.gl.getAttribLocation(me.NormalProgram, 'vertexTexCoord0'),
            vertexTangent: me.gl.getAttribLocation(me.NormalProgram, 'vertexTangent')
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

        me.SpecularProgram.attribs = {
            vPos: me.gl.getAttribLocation(me.SpecularProgram, 'vPos'),
			vNorm: me.gl.getAttribLocation(me.SpecularProgram, 'vNorm'),
            texCoordAttributeLocation: me.gl.getAttribLocation(me.SpecularProgram, 'vertTextCoord')
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

    postProcessSetup(me.gl);
    
};

DemoScene.prototype.Unload = function (){
    this.ChamberMesh = null;
    this.NoShadowProgram = null;
    this.SpecularProgram = null;
    this.DitherProgram = null;
    this.ColorProgram = null;
    this.NormalProgram = null;
    this.camera = null;
    this.lightPosition = null;
    this.lightPositionNormals = null;
    me.isLightRotating = null;
    this.Meshes = null;
    this.Outlines = null;
    this.Dialogue_Meshes = null;
    this.PressedKeys = null;
};

DemoScene.prototype.Begin = function (){
    console.log('Beginning demo scene');
    var me = this;

    // Add event listeners
    this.__ResizeWindowListener = this._OnResizeWindow.bind(this);
    this.__KeyDownListener = this._onKeyDown.bind(this);
    this.__KeyUpListener = this._onKeyUp.bind(this);
    this.__MouseMoveListener = this._onMouseMove.bind(this);

    AddEvent(window, 'resize', this.__ResizeWindowListener);
    AddEvent(window, 'keydown', this.__KeyDownListener);
    AddEvent(window, 'keyup', this.__KeyUpListener);
    AddEvent(window, 'mousemove', this.__MouseMoveListener);

    // Render Loop
    var previuousFrame = performance.now();
    var dt = 0;
    var loop = function (currentFrameTime){
        dt = currentFrameTime - previuousFrame;
        me._Update(dt);

        previuousFrame = currentFrameTime;
        var gl = me.gl; //in loop
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        me._Outlines();
        me._Render();
        me._Specular();
        me._NormalMap();
        me._Dither();

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        me._PostProcess();

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

function load_models({target, name, gl, mesh, texture, outlineColor, displayName}){
    target[name] = new Model(
        gl,
        mesh.vertices,
        [].concat.apply([], mesh.faces),
        mesh.normals,
        mesh.texturecoords[0],
        texture,
        outlineColor,
        displayName
    );
    // for (var i = 0; i < passed_model.length; i++) {
    //     console.log(i);
    // }

}

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

    if(this.Ornstein_rotate == true){
        glMatrix.mat4.rotateY(
            this.Ornstein.world, this.Ornstein.world,
            dt/1000 * 2 * Math.PI *   (0.2)//rotations per second
        );
        glMatrix.mat4.rotateY(
            this.Ornstein_hair.world, this.Ornstein_hair.world,
            dt/1000 * 2 * Math.PI *   (0.2)//rotations per second
        );
    }

    // specular shift
    if(this.enable_specular_demonstration == true){
        const slecular_light_change_rate = 1.9;
        const specular_change = slecular_light_change_rate * (dt/1000)

        if(this.specular_intensity[0] >= 3.0){
            this.specular_swich = 0;
        }
        if(this.specular_intensity[0] <= 0.0){
            this.specular_swich = 1;
        }
        // console.log(this.specular_swich);
        if (this.specular_swich == 0){
            for (let i = 0; i < 3; i++) {
                this.specular_intensity[i] -= specular_change;
            }
        }else{
            for (let i = 0; i < 3; i++) {
                this.specular_intensity[i] += specular_change;
            }
        }
    }

    // brightness shift
    if(this.enable_brightness_shift == true){
        // console.log("brighness should shift: " + this.PP_ColorChanels)
        const brightness_change_rate = 1.3;
        const brightness_change = brightness_change_rate * (dt/1000)

        if(this.PP_ColorChanels[0] >= 3.0){
            this.brightness_switch = 0;
        }
        if(this.PP_ColorChanels[0] <= 0.5){
            this.brightness_switch = 1;
        }
        // console.log(this.brightness_switch);
        if (this.brightness_switch == 0){
            for (let i = 0; i < 3; i++) {
                this.PP_ColorChanels[i] -= brightness_change;
            }
        }else{
            for (let i = 0; i < 3; i++) {
                this.PP_ColorChanels[i] += brightness_change;
            }
        }
    }
    
    if (this.copyVideo) {
        updateTexture(this.gl, this.videoTexture, this.video);
        this.PlaneMesh.texture = this.videoTexture;
    }
    // else{
    //     this.PlaneMesh.texture = this.Gojo_Statue_Texture;
    // }
   

    if(this.isLightRotating == true){
        const pos3 = [
            this.lightPositionNormals[0],
            this.lightPositionNormals[1],
            this.lightPositionNormals[2]
        ];

        glMatrix.vec3.rotateZ(
            pos3,
            pos3,
            [0.4, 0.0, -0.33],
            glMatrix.glMatrix.toRadian(1)
        );

        this.lightPositionNormals[0] = pos3[0];
        this.lightPositionNormals[1] = pos3[1];
    }
    
    

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
            InitiateConversation(model.name, 1, this.PressedKeys.F);
            break; //else the check works only on the last model in the array
                
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

	if (this.PressedKeys.Up && !this.PressedKeys.Down && this.can_cam_move == true) {
		this.camera.moveUp(dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.Down && !this.PressedKeys.Up && this.can_cam_move == true) {
		this.camera.moveUp(-dt / 1000 * this.MoveForwardSpeed);
	}

	if (this.PressedKeys.RotRight && !this.PressedKeys.RotLeft && this.can_cam_move == true) {
		this.camera.rotateRight(-dt / 1000 * this.RotateSpeed);
	}

	if (this.PressedKeys.RotLeft && !this.PressedKeys.RotRight && this.can_cam_move == true) {
		this.camera.rotateRight(dt / 1000 * this.RotateSpeed);
	}
    this.camera.GetViewMatrix(this.viewMatrix);
    // console.log(this.camera.position);
};

DemoScene.prototype._PostProcess = function(){
    var gl = this.gl;
    //clear color
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1); //Background color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindVertexArray(postProcessVao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, postProcessIbo);
    gl.useProgram(this.PostProcessProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
    gl.uniform1i(this.PostProcessProgram.uniforms.sampler, 0);
    gl.uniform3fv(this.PostProcessProgram.uniforms.colorChanels, this.PP_ColorChanels);
    gl.uniform3fv(this.PostProcessProgram.uniforms.edgeColor, this.edgeColor);
    gl.uniform3fv(this.PostProcessProgram.uniforms.DuotoneLight, this.DuotoneLight);
    gl.uniform3fv(this.PostProcessProgram.uniforms.DuotoneDark, this.DuotoneDark);
    gl.uniform2f(
        this.PostProcessProgram.uniforms.canvasResolution,
        this.textureWidth,
        this.textureHeight
    );
    gl.uniform2f(
        this.PostProcessProgram.uniforms.windowResolution,
        window.innerWidth,
        window.innerHeight
    );
    //offsets
    gl.uniform1f(this.PostProcessProgram.uniforms.REDxOffset, this.REDxOffset);
    gl.uniform1f(this.PostProcessProgram.uniforms.REDyOffset, this.REDyOffset);
    gl.uniform1f(this.PostProcessProgram.uniforms.GREENxOffset, this.GREENxOffset);
    gl.uniform1f(this.PostProcessProgram.uniforms.GREENyOffset, this.GREENyOffset);
    gl.uniform1f(this.PostProcessProgram.uniforms.BLUExOffset, this.BLUExOffset);
    gl.uniform1f(this.PostProcessProgram.uniforms.BLUEyOffset, this.BLUEyOffset);
    gl.uniform2f(
        this.PostProcessProgram.uniforms.mousePos,
        this.mousePos.x,
        this.mousePos.y
    );

    //on/off shaders
    gl.uniform1i(this.PostProcessProgram.uniforms.useCA, this.useChromatic);
    gl.uniform1i(this.PostProcessProgram.uniforms.useDither, this.useDither);
    gl.uniform1i(this.PostProcessProgram.uniforms.useBlur, this.useBlur);
    gl.uniform1i(this.PostProcessProgram.uniforms.useSobel, this.useSobel);
    gl.uniform1i(this.PostProcessProgram.uniforms.useColor, this.useColor);
    gl.uniform1i(this.PostProcessProgram.uniforms.useDuotone, this.useDuotone);
    gl.uniform1i(this.PostProcessProgram.uniforms.useThreshold, this.useThreshold);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

    //unbind buffers
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
}

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
        
        // Clean up attributes
        gl.disableVertexAttribArray(this.ColorProgram.attribs.vPos);
        gl.disableVertexAttribArray(this.ColorProgram.attribs.vNorm);
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
        
        // Clean up attributes
        gl.disableVertexAttribArray(this.NoShadowProgram.attribs.vPos);
        gl.disableVertexAttribArray(this.NoShadowProgram.attribs.vNorm);
        gl.disableVertexAttribArray(this.NoShadowProgram.attribs.texCoordAttributeLocation);
    }


};

//spec shader
DemoScene.prototype._Specular = function () {
    var gl = this.gl;

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    // gl.clearColor(0, 0, 0, 1);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    gl.useProgram(this.SpecularProgram);
    gl.uniformMatrix4fv(this.SpecularProgram.uniforms.mProj, gl.FALSE, this.projMatrix);
    gl.uniformMatrix4fv(this.SpecularProgram.uniforms.mView, gl.FALSE, this.viewMatrix);
    gl.uniform3fv(this.SpecularProgram.uniforms.pointLightPosition, [-5.0, 1.0, 2.0]);

    gl.uniform3fv(this.SpecularProgram.uniforms.material_specular, [0.5, 0.5, 0.5]);
    gl.uniform1f(this.SpecularProgram.uniforms.shininess, 10.0); //reflection size
    gl.uniform3fv(this.SpecularProgram.uniforms.ambient, [0.2, 0.2, 0.2]);
    gl.uniform3fv(this.SpecularProgram.uniforms.light_specular, this.specular_intensity); //increase reflection intensity

    gl.uniform3fv(this.SpecularProgram.uniforms.viewPos, this.camera.position); //this.camera.position
    
    gl.uniform1i(this.SpecularProgram.uniforms.use_spec_map, this.use_spec_map);
   
    gl.uniform1i(this.SpecularProgram.uniforms.base_text, 0);
    gl.uniform1i(this.SpecularProgram.uniforms.specular_text, 1);

    // Draw meshes

    for (var i = 0; i < this.SpecularMeshes.length; i++){

        //Set Texture for each model
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.SpecularMeshes[i].texture);
       

        //set specular
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.SpecularTextures[i]);
        

        // Per object uniforms
        gl.uniformMatrix4fv(
            this.SpecularProgram.uniforms.mWorld,
            gl.FALSE,
            this.SpecularMeshes[i].world
        );
        

        // Set Atribs
        gl.bindBuffer(gl.ARRAY_BUFFER, this.SpecularMeshes[i].vbo);
        gl.vertexAttribPointer(
            this.SpecularProgram.attribs.vPos,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.SpecularProgram.attribs.vPos);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.SpecularMeshes[i].nbo);
        gl.vertexAttribPointer(
            this.SpecularProgram.attribs.vNorm,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.SpecularProgram.attribs.vNorm);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.SpecularMeshes[i].tbo);
        gl.vertexAttribPointer(
            this.SpecularProgram.attribs.texCoordAttributeLocation, //Attribute location
            2, //Number of elements per attribute (vecX) color
            gl.FLOAT, //Type of elements
            gl.FALSE, //Is data normalised
            2 * Float32Array.BYTES_PER_ELEMENT,//Size of an individual vertex
            0 //Offset from the beginning of a single vertex to tris attribute
        );
        gl.enableVertexAttribArray(this.SpecularProgram.attribs.texCoordAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.SpecularMeshes[i].ibo);
        gl.drawElements(gl.TRIANGLES, this.SpecularMeshes[i].nPoints, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        // Clean up attributes
        gl.disableVertexAttribArray(this.SpecularProgram.attribs.vPos);
        gl.disableVertexAttribArray(this.SpecularProgram.attribs.vNorm);
        gl.disableVertexAttribArray(this.SpecularProgram.attribs.texCoordAttributeLocation);
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
        
        // Clean up attributes
        gl.disableVertexAttribArray(this.DitherProgram.attribs.vPos);
        gl.disableVertexAttribArray(this.DitherProgram.attribs.vNorm);
        gl.disableVertexAttribArray(this.DitherProgram.attribs.texCoordAttributeLocation);
    }
};

DemoScene.prototype._NormalMap = function (){
    var gl = this.gl;

    // Clear back buffer, set per-frame uniforms
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // gl.clear(gl.DEPTH_BUFFER_BIT);
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    // gl.clearColor(0.0, 0.0, 0.0, 1); //Background color
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    
    gl.useProgram(this.NormalProgram);
    gl.uniform4fv(this.NormalProgram.uniforms.lightColor,[1.0, 1.0, 1.0, 1.0]);
    gl.uniform4fv(this.NormalProgram.uniforms.lightPosition, this.lightPositionNormals); //[0.0, 0.0, 0.0, 1.0]
    gl.uniform3fv(this.NormalProgram.uniforms.lightAttenuations,[1.0, 0.09, 0.032]);
    gl.uniform4fv(this.NormalProgram.uniforms.materialAmbient,[0.2, 0.2, 0.2, 1.0]);
    gl.uniform4fv(this.NormalProgram.uniforms.materialDiffuse,[1.0, 1.0, 1.0, 1.0]);
    gl.uniform4fv(this.NormalProgram.uniforms.materialSpecular,[1.0, 1.0, 1.0, 1.0]);
    gl.uniform1f(this.NormalProgram.uniforms.materialShininess, 32.0);
    gl.uniform1i(this.NormalProgram.uniforms.renderResult, this.NormalShaderResultIndicator);
    gl.uniform1i(this.NormalProgram.uniforms.useSpecular, this.useSpecular);

    gl.uniform1i(this.NormalProgram.uniforms.map0, 0);
    gl.uniform1i(this.NormalProgram.uniforms.map1, 1);

    gl.uniform2f(
        this.NormalProgram.uniforms.normalMapResolution,
        this.textureWidth,
        this.textureHeight
    );
    gl.uniform1i(this.NormalProgram.uniforms.isMapGenerated, this.isMapGenerated);
    

    // Draw meshes

    for (var i = 0; i < this.NormalMeshes.length; i++){

        //Set Texture for each model
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.NormalMeshes[i].texture);
        // gl.uniform1i(this.DitherProgram.uniforms.map0, 0);


        // Set normal texture
        // gl.uniform1i(this.DitherProgram.uniforms.map1, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.Normal_Texture);

        // Per object uniforms
        // gl.uniform4fv(
        //     this.NormalProgram.uniforms.meshColor,
        //     this.NormalMeshes[i].color
        // );

        var mv = glMatrix.mat4.create();
        glMatrix.mat4.multiply(mv, this.viewMatrix, this.NormalMeshes[i].world);
        var mvp = glMatrix.mat4.create();
        glMatrix.mat4.multiply(mvp, this.projMatrix, mv);
        var normalMat = glMatrix.mat4.create();
        glMatrix.mat4.invert(normalMat, mv);
        glMatrix.mat4.transpose(normalMat, normalMat);

        gl.uniformMatrix4fv(this.NormalProgram.uniforms.matrixModelView, gl.FALSE, mv);
        gl.uniformMatrix4fv(this.NormalProgram.uniforms.matrixModelViewProjection, gl.FALSE, mvp);
        gl.uniformMatrix4fv(this.NormalProgram.uniforms.matrixNormal, gl.FALSE, normalMat);
        

        // Set Atribs
        gl.bindBuffer(gl.ARRAY_BUFFER, this.NormalMeshes[i].vbo);
        gl.vertexAttribPointer(
            this.NormalProgram.attribs.vertexPosition,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.NormalProgram.attribs.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.NormalMeshes[i].nbo);
        gl.vertexAttribPointer(
            this.NormalProgram.attribs.vertexNormal,
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.NormalProgram.attribs.vertexNormal);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.NormalMeshes[i].tbo);
        gl.vertexAttribPointer(
            this.NormalProgram.attribs.vertexTexCoord0, //Attribute location
            2, //Number of elements per attribute (vecX) color
            gl.FLOAT, //Type of elements
            gl.FALSE, //Is data normalised
            2 * Float32Array.BYTES_PER_ELEMENT,//Size of an individual vertex
            0 //Offset from the beginning of a single vertex to tris attribute
        );
        gl.enableVertexAttribArray(this.NormalProgram.attribs.vertexTexCoord0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.NormalMeshes[i].tanbo);
        gl.vertexAttribPointer(
            this.NormalProgram.attribs.vertexTangent, //Attribute location
            3, gl.FLOAT, gl.FALSE,
            0, 0
        );
        gl.enableVertexAttribArray(this.NormalProgram.attribs.vertexTangent);


        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.NormalMeshes[i].ibo);
        gl.drawElements(gl.TRIANGLES, this.NormalMeshes[i].nPoints, gl.UNSIGNED_SHORT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        // Clean up attributes
        gl.disableVertexAttribArray(this.NormalProgram.attribs.vertexPosition);
        gl.disableVertexAttribArray(this.NormalProgram.attribs.vertexNormal);
        gl.disableVertexAttribArray(this.NormalProgram.attribs.vertexTexCoord0);
        gl.disableVertexAttribArray(this.NormalProgram.attribs.vertexTangent);
    }
}

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
    resizeFramebuffer(gl, gl.canvas);

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
    // 4 - point up
    //20 - Show Box Mesh
    //30 - Ornstein helm 
    //40 - Plane/Picture Mesh

    if (current_mesh >= 40 && current_mesh < 50){
        glMatrix.mat4.identity(this.PlaneMesh.world);
        if (current_mesh == 40){
            glMatrix.mat4.scale(
                this.PlaneMesh.world,         
                this.PlaneMesh.world,         
                glMatrix.vec3.fromValues(0.15, 0.15, 0.15) // scale X/Y/Z
            );
        }
        else{
            glMatrix.mat4.scale(
                this.PlaneMesh.world,         
                this.PlaneMesh.world,         
                glMatrix.vec3.fromValues(0.0, 0.0, 0.0) // scale X/Y/Z
            );
        }
        glMatrix.mat4.rotate(
            this.PlaneMesh.world, this.PlaneMesh.world,
            glMatrix.glMatrix.toRadian(90),
            glMatrix.vec3.fromValues(0, -1, 0)
        );
        glMatrix.mat4.translate(
            this.PlaneMesh.world, this.PlaneMesh.world,
            this.planePosition
        );
        return;
    }

    if (current_mesh >= 30 && current_mesh < 40){
        for (var i = 0; i < 2; i++){
            glMatrix.mat4.identity(this.SpecularMeshes[i].world);

            if (current_mesh == 30){
                glMatrix.mat4.scale(
                    this.SpecularMeshes[i].world,         
                    this.SpecularMeshes[i].world,         
                    this.ornstein_scale
                );
            }else{
                glMatrix.mat4.scale(
                    this.SpecularMeshes[i].world,         
                    this.SpecularMeshes[i].world,         
                    glMatrix.vec3.fromValues(0.0, 0.0, 0.0)
                );
            }

            glMatrix.mat4.rotate(
                this.SpecularMeshes[i].world,  this.SpecularMeshes[i].world,
                glMatrix.glMatrix.toRadian(90),
                glMatrix.vec3.fromValues(0, -1, 0)
            );
            glMatrix.mat4.translate(
                this.SpecularMeshes[i].world, this.SpecularMeshes[i].world,
                this.ornstein_position
            );
        }
        return;
    }

    if (current_mesh >= 20 && current_mesh < 30){
        glMatrix.mat4.identity(this.BoxMesh.world);
        if (current_mesh == 20){
            glMatrix.mat4.scale(
                this.BoxMesh.world,         
                this.BoxMesh.world,         
                glMatrix.vec3.fromValues(0.1, 0.1, 0.1) // scale X/Y/Z
            );
        }
        else{
            glMatrix.mat4.scale(
                this.BoxMesh.world,         
                this.BoxMesh.world,         
                glMatrix.vec3.fromValues(0.0, 0.0, 0.0) // scale X/Y/Z
            );
        }
        glMatrix.mat4.rotate(
            this.BoxMesh.world, this.BoxMesh.world,
            glMatrix.glMatrix.toRadian(90),
            glMatrix.vec3.fromValues(-1, 0, 0)
        );
        glMatrix.mat4.translate(
            this.BoxMesh.world, this.BoxMesh.world,
            glMatrix.vec4.fromValues(0, -5.3, 43.8)
        );
        return;
    }

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

DemoScene.prototype.Set_Image_as_Normal = function(){
    var gl = this.gl;

    // ctx.filter = "blur(3px)";
    // ctx.drawImage(canvas, 0, 0);
    // ctx.filter = "none";
    this.lightPositionNormals = glMatrix.vec4.fromValues(0.4, 0.25, -0.33, 1.0);
    gl.bindTexture(gl.TEXTURE_2D, this.Normal_Texture);

    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, 
        gl.UNSIGNED_BYTE,
        canvas
    );

    gl.bindTexture(gl.TEXTURE_2D, this.Cube_Texture);

    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, 
        gl.UNSIGNED_BYTE,
        canvas
    );


    this.textureWidth = canvas.width;
    this.textureHeight =  canvas.height;
    this.isMapGenerated = 1;
    this.isLightRotating = true;
}

DemoScene.prototype.Set_Crate_example = function(useSpecular){
    // var gl = this.gl;

    this.lightPositionNormals = glMatrix.vec4.fromValues(0.4, 0.25, -0.33, 1.0);
    this.BoxMesh.texture = this.Specular_Base_Texture;


    this.textureWidth = 400;
    this.textureHeight =  400;
    this.isMapGenerated = 0;
    this.isLightRotating = true;
    this.useSpecular = useSpecular;
}

DemoScene.prototype.changeNormalShaderRenderResult = function(newShaderIndicator){
    this.NormalShaderResultIndicator = newShaderIndicator;
}

DemoScene.prototype.configureSpecular = function (spec_map, enable_rotation){
    this.use_spec_map = spec_map;
    this.enable_specular_demonstration = enable_rotation;
}
DemoScene.prototype._onMouseMove = function (){
    let rect = canvas.getBoundingClientRect();
    this.mousePos.x = event.clientX - rect.left;
    this.mousePos.y = event.clientY - rect.top;

    // console.log("Coordinate x: " + this.mousePos.x, "Coordinate y: " + this.mousePos.y);

}


//set up video
function setupVideo(url) {
  const video = document.createElement("video");

  let playing = false;
  let timeupdate = false;

  video.playsInline = true;
  video.muted = true;
  video.loop = true;
  
  // Style the video element to appear on the page
  
  video.style.position = "fixed";
  video.style.top = "33.5%";
  video.style.left = "65%";
  video.style.transform = "translate(-50%, -50%)";
  video.style.width = "52vh";
  video.style.height = "auto";
  video.style.border = "2px solid white";
  video.style.borderRadius = "5px";
  video.style.zIndex = "1000";
  video.style.display = "none"

  // Waiting for these 2 events ensures
  // there is data in the video

  video.addEventListener("playing", () => {
    playing = true;
    checkReady();
  });

  video.addEventListener("timeupdate", () => {
    timeupdate = true;
    checkReady();
  });

  video.src = url;
  video.play();
  
  // Append to document body so it's visible
  document.body.appendChild(video);

  function checkReady() {
    if (playing && timeupdate) {
      video.copyVideo = true;
    }
  }

  return video;
}

//create video texture
function initTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because video has to be download over the internet
  // they might take a moment until it's ready so
  // put a single pixel in the texture so we can
  // use it immediately.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel,
  );

  // Turn off mips and set wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function updateTexture(gl, texture, video) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video,
  );
}
