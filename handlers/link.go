package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	linkdto "server/dto/link"
	dto "server/dto/result"
	"server/models"
	"server/pkg/uniquelink"
	"server/repositories"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
)

type handlerLink struct {
	LinkRepository repositories.LinkRepository
}

func HandlerLink(LinkRepository repositories.LinkRepository) *handlerLink {
	return &handlerLink{LinkRepository}
}

func (h *handlerLink) CreateLInk(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	// dataContext := r.Context().Value("dataFile")
	// filename := dataContext.(string)

	dataContex := r.Context().Value("	")
	filepath := dataContex.(string)

	request := linkdto.LinkRequest{
		Title:       r.FormValue("title"),
		Description: r.FormValue("description"),
		Template:    r.FormValue("template"),
	}

	link := models.Link{
		Title:       request.Title,
		Description: request.Description,
		UserID:      userId,
		Template:    request.Template,
		Image:       filepath,
		Visit:       0,
		UniqueLink:  uniquelink.GenerateUniqueLink(),
	}

	var ctx = context.Background()
	var CLOUD_NAME = "dj2zuoyjz"
	var API_KEY = "823843693691955"
	var API_SECRET = "CYh1diS0jMTEAxPNP4yPeYj69UQ"

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "wayslink"})
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	data, err := h.LinkRepository.CreateLInk(link)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
	}

	linkResponse := linkdto.LinkResponse{
		ID:          data.ID,
		Title:       data.Title,
		Description: data.Description,
		Image:       resp.SecureURL,
		Visit:       data.Visit,
		Template:    data.Template,
		UniqueLink:  data.UniqueLink,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: linkResponse}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerLink) FindUserLink(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	link, err := h.LinkRepository.FindUserLink(userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: link}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerLink) GetLink(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	unique_link := mux.Vars(r)["unique_link"]

	link, err := h.LinkRepository.GetLink(unique_link)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	filePath := os.Getenv("PATH_FILE")

	Response := linkdto.LinkResponse{
		ID:          link.ID,
		Title:       link.Title,
		Description: link.Description,
		Image:       filePath + link.Image,
		Visit:       link.Visit,
		Template:    link.Template,
		UserID:      link.UserID,
		UniqueLink:  link.UniqueLink,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: Response}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerLink) DeleteLink(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	unique_link := mux.Vars(r)["unique_link"]

	link, err := h.LinkRepository.GetLink(unique_link)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	data, err := h.LinkRepository.DeleteLink(link, unique_link)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerLink) UpdateLink(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	request := new(linkdto.LinkRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	unique_link := mux.Vars(r)["unique_link"]

	link, err := h.LinkRepository.GetLink(unique_link)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	if request.Visit != 0 {
		link.Visit = request.Visit
	}

	updatelink, err := h.LinkRepository.UpdateLink(link, unique_link)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: updatelink}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerLink) EditeLink(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	filepath := ""

	dataContex := r.Context().Value("dataFile")
	if dataContex != nil {
		filepath = dataContex.(string)
	}

	request := linkdto.LinkRequest{
		Title:       r.FormValue("title"),
		Description: r.FormValue("description"),
	}

	unique_link := mux.Vars(r)["unique_link"]

	link, err := h.LinkRepository.GetLink(unique_link)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

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

	if request.Title != "" {
		link.Title = request.Title
	}
	if request.Description != "" {
		link.Description = request.Description
	}
	if filepath != "" {
		link.Image = resp.SecureURL
	}

	updatelink, err := h.LinkRepository.EditeLink(link, unique_link)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: updatelink}
	json.NewEncoder(w).Encode(response)
}
