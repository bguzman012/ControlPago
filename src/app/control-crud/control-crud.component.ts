import { Component } from '@angular/core';
import { Product } from './product';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-control-crud',
    templateUrl: './control-crud.component.html',
    styleUrls: ['./control-crus.scss']
})
export class ControlCrudComponent {
    productDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    constructor(private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.products = []
    }

    interval(product: Product) {
        const interval_id = setInterval(() => {
            let index = this.products.findIndex(item => item.id === product.id);
            let contador = this.products[index].contador
            if (contador != undefined) {
                contador++
                this.products[index].contador = contador
            }
            if ("Notification" in window) {
                // La API de notificación es compatible
                if (Notification.permission !== "granted") {
                    Notification.requestPermission();
                }

            }
            if (this.products[index].tiempo == this.products[index].contador) {
                this.enviarNotificacion(product)
                this.products[index].estado = 'TERMINADO'
                clearInterval(interval_id);

            }

            // for (let i = 0; i < this.products.length; i++) {
            //     console.log(this.products[i].contador)
            //     if (this.products[i].contador != undefined && this.products[i].estado == 'ACTIVO') {


            //     }
            // }
        }, 2000);
    }

    enviarNotificacion(product: Product) {
        var notificacion = new Notification("¡Sesión finalizada!", {
            icon: "https://cdn.dribbble.com/users/1787323/screenshots/12057610/media/c7d7a0d03302859b85e95f2b95108688.png?compress=1&resize=400x300&vertical=top",
            body: "Ha terminado el tiempo de uso de la máquina " + product.name,
        });
        const sound = new Audio('https://proxy.notificationsounds.com/voice-ringtones/completed-voice-ringtone/download/file-sounds-1165-completed.mp3');
        sound.play();
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => !this.selectedProducts.includes(val));
                this.selectedProducts = [];
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
            }
        });
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => val.id !== product.id);
                this.product = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (!this.product.name)
            return

        if (this.product.name.trim()) {
            if (this.product.id) {
                this.product.inicio = new Date()
                this.product.contador = 0
                this.product.estado = 'ACTIVO'
                const newDate = new Date(this.product.inicio.getTime());
                if (this.product.tiempo != undefined)
                    newDate.setMinutes(this.product.inicio.getMinutes() + this.product.tiempo);

                this.product.fin = newDate
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Maquina actualizada', life: 3000 });
            }
            else {
                this.product.id = this.createId();
                this.products.push(this.product);
                this.product.inicio = new Date()
                this.product.contador = 0
                this.product.estado = 'ACTIVO'

                const newDate = new Date(this.product.inicio.getTime());
                if (this.product.tiempo != undefined)
                    newDate.setMinutes(this.product.inicio.getMinutes() + this.product.tiempo);

                this.product.fin = newDate

                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Maquina creada', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.interval(this.product)

            this.products.sort((a, b) => {
                if (a.inicio && b.inicio) {
                    if (a.inicio > b.inicio) {
                        return -1;
                    }
                    if (a.inicio < b.inicio) {
                        return 1;
                    }
                }
                return 0;
            });

            this.product = {};
        }

    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}
