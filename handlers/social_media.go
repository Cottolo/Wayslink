package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	dto "server/dto/result"
	socialmediadto "server/dto/socialMedia"
	"server/models"
	"server/repositories"
	"strconv"

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
	// get file name
	dataContext := r.Context().Value("dataFile")
	filename := dataContext.(string)

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
		Image:           filename,
	}

	data, err := h.SocialMediaRepository.CreateSocialMedia(socialMedia)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
	}

	socialMediaResponse := socialmediadto.SocialMediaResponse{
		LinkID:          data.LinkID,
		SocialMediaName: data.SocialMediaName,
		Url:             data.Url,
		Image:           data.Image,
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

	socmedImage := r.Context().Value("dataFile")
	fileName := socmedImage.(string)

	request := socialmediadto.SocialMediaRequest{
		SocialMediaName: r.FormValue("social_media_name"),
		Url:             r.FormValue("url"),
	}

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	socmed := models.SocialMedia{}

	if request.SocialMediaName != "" {
		socmed.SocialMediaName = request.SocialMediaName
	}
	if request.Url != "" {
		socmed.Url = request.Url
	}
	if fileName != "" {
		socmed.Image = fileName
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
