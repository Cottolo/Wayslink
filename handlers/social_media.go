package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	dto "server/dto/result"
	socialmediadto "server/dto/socialMedia"
	"server/models"
	"server/repositories"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type handlerSocialMedia struct {
	SocialMediaRepository repositories.SocialMediaRepository
}

func HandlerSocialMedia(SocialMediaRepository repositories.SocialMediaRepository) *handlerSocialMedia {
	return &handlerSocialMedia{SocialMediaRepository}
}

func (h *handlerSocialMedia) CreateSocialMedia(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	dataContex := r.Context().Value("dataFile")
	filepath := dataContex.(string)

	linkID, _ := strconv.Atoi(r.FormValue("link_id"))

	request := socialmediadto.SocialMediaRequest{
		LinkID:          linkID,
		SocialMediaName: r.FormValue("social_media_name"),
		Url:             r.FormValue("url"),
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	socialMedia := models.SocialMedia{
		LinkID:          request.LinkID,
		SocialMediaName: request.SocialMediaName,
		Url:             request.Url,
		Image:           filepath,
	}

	var ctx = context.Background()
	// var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	// var API_KEY = os.Getenv("API_KEY")
	// var API_SECRET = os.Getenv("API_SECRET")
	var CLOUD_NAME = "dhtuf2uie"
	var API_KEY = "261795218548971"
	var API_SECRET = "Vi1u3vbz3Ex5e93BWnKMEzaAgT8"

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "wayslink"})
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	data, err := h.SocialMediaRepository.CreateSocialMedia(socialMedia)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	socialMediaResponse := socialmediadto.SocialMediaResponse{
		LinkID:          data.LinkID,
		SocialMediaName: data.SocialMediaName,
		Url:             data.Url,
		Image:           resp.SecureURL,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: socialMediaResponse}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerSocialMedia) GetSocialMedia(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	link_id, _ := strconv.Atoi(mux.Vars(r)["link_id"])

	socialMedias, err := h.SocialMediaRepository.GetSocialMedia(link_id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}
	filePath := os.Getenv("PATH_FILE")
	socialMediaResponse := make([]socialmediadto.SocialMediaResponse, 0)

	for _, socialMedia := range socialMedias {
		socialMediaResponse = append(socialMediaResponse, socialmediadto.SocialMediaResponse{
			ID:              socialMedia.ID,
			LinkID:          socialMedia.LinkID,
			SocialMediaName: socialMedia.SocialMediaName,
			Url:             socialMedia.Url,
			Image:           filePath + socialMedia.Image,
		})
	}
	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: socialMediaResponse}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerSocialMedia) EditeSocialMedia(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	filepath := ""
	dataContex := r.Context().Value("dataFile")
	if dataContex != nil {
		filepath = dataContex.(string)
	}

	request := socialmediadto.SocialMediaRequest{
		SocialMediaName: r.FormValue("social_media_name"),
		Url:             r.FormValue("url"),
	}

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	// Add your Cloudinary credentials ...
	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	// Upload file to Cloudinary ...
	resp, err := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "dumbmerch"})

	if err != nil {
		fmt.Println(err.Error())
	}

	socmed := models.SocialMedia{}

	if request.SocialMediaName != "" {
		socmed.SocialMediaName = request.SocialMediaName
	}
	if request.Url != "" {
		socmed.Url = request.Url
	}
	if filepath != "" {
		socmed.Image = resp.SecureURL
	}

	editelink, err := h.SocialMediaRepository.EditeSocialMedia(socmed, id)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: editelink}
	json.NewEncoder(w).Encode(response)
}
