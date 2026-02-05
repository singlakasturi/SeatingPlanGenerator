package Seating.Planner.NITJ.model;

public class RoomFileDTO {

    private String fileName;   // ex: 2025-12-04/LT-101.pdf
    private String fileData;   // base64

    public RoomFileDTO() {}

    public RoomFileDTO(String fileName, String fileData) {
        this.fileName = fileName;
        this.fileData = fileData;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileData() {
        return fileData;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setFileData(String fileData) {
        this.fileData = fileData;
    }
}
