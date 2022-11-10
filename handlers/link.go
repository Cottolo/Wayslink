package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	linkdto "server/dto/link"
	dto "server/dto/result"
	"server/models"
	"server/pkg/uniquelink"
	"server/repositories"

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

	dataContext := r.Context().Value("dataFile")
	filename := dataContext.(string)

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
		Image:       filename,
		UniqueLink:  uniquelink.GenerateUniqueLink(),
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
		Image:       data.Image,
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

	linksResponse := make([]linkdto.LinkResponse, 0)

	filePath := os.Getenv("PATH_FILE")

	for _, link := range link {
		linksResponse = append(linksResponse, linkdto.LinkResponse{
			ID:          link.ID,
			Title:       link.Title,
			Description: link.Description,
			Image:       filePath + link.Image,
			Template:    link.Template,
			UniqueLink:  link.UniqueLink,
		})
	}
	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: linksResponse}
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
	fmt.Println(filePath)

	previewResponse := linkdto.LinkResponse{
		ID:          link.ID,
		Title:       link.Title,
		Description: link.Description,
		Image:       filePath + link.Image,
		Template:    link.Template,
		UniqueLink:  link.UniqueLink,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: previewResponse}
	json.NewEncoder(w).Encode(response)

}
