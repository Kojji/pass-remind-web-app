<template>
  <div id="modalChangeFoto">
    <v-dialog v-model="openDialog" max-width="240">
      <v-card class="mx-auto">
        <v-card-title>Mudar Foto</v-card-title>
        <v-form
          ref="formFoto"
          lazy-validation
        >
          <v-card-actions>
            <v-container fluid>
              <v-row class="justify-center mb-5">
                <v-avatar
                  v-if="imageUrl"
                  color="orange"
                  size="70"  
                >
                  <v-img 
                    :src="imageUrl"
                  >
                  </v-img>
                </v-avatar>
                <v-avatar
                  v-else
                  color="orange"
                  size="70"  
                >
                  <v-icon 
                    dark
                    size="70"
                  >
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
              </v-row>
              <v-row class="justify-center">
                <v-file-input
                  label="Foto de Perfil"
                  outlined
                  show-size
                  class="pa-2"
                  :rules="uploadRules"
                  prepend-icon="mdi-camera"
                  accept="image/png, image/jpeg, image/bmp"
                  @change="onChangeFoto($event)"
                ></v-file-input>
              </v-row>
              <v-row class="justify-center">
                <v-btn
                  color="orange"
                  outlined
                  class="mx-1"
                  small
                  @click="openDialog = false"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  :disable="getStoreButtonLoading"
                  :loading="getStoreButtonLoading"
                  color="success"
                  outlined
                  class="mx-1"
                  small
                  @click="saveImg"
                >
                  Mudar
                </v-btn>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "modalChangeFoto",
  props: {
    value: Boolean
  },
  data() {
    return {
      uploadRules: [
        value => !value || value.size < 500000 || 'Imagem deve ter menos de 500kB!',
        value => !!value || 'É preciso selecionar uma imagem'
      ],
      imageUrl: "",
      imageFile: "",
      imageName: "",
    }
  },
  computed:{
    ...mapGetters([
      "getStoreButtonLoading"
    ]),
    openDialog: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
        this.reset();
      }
    },
  },
  methods: {
    reset() {
      this.imageUrl = "";
      this.imageFile = "";
      this.imageName = "";
    },
    onChangeFoto(event) {
      const file = event;
      if (file !== undefined) {
        this.imageName = event.name;
        this.imageUrl = URL.createObjectURL(file);
        this.imageFile = file;
      } else {
        this.reset();
      }
    },
    saveImg() {
      if (this.$refs.formFoto.validate()) {
        this.$store.commit("setStoreButtonLoading", true);
        this.$store.dispatch("registerFoto",this.imageFile)
          .then(()=>{
            this.$store.commit("setSnackOn","Foto de perfil atualizada!");
            this.openDialog = false;
          }).catch(()=>{
            this.$store.commit("setSnackOn","Erro ao tentar atualizar foto de perfil!");
          }).finally(()=>{
            this.$store.commit("setStoreButtonLoading", false);
          })
      }
    }
  }
}
</script>